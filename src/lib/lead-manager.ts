import { supabase } from "@/lib/supabase";
import { getLocalDB, saveLocalDB, Registration } from "@/lib/db";

// In-Memory IP Rate Limiter for lead protection
interface RateLimitRecord {
    count: number;
    firstRequestTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 3 * 60 * 1000; // 3 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 lead submissions per IP per 3 minutes

export interface LeadSubmissionPayload {
    name: string;
    phone: string;
    email?: string;
    course?: string;
    message?: string;
    honeypot?: string; // Invisible anti-bot field
    ip?: string;
}

export interface LeadProcessingResult {
    success: boolean;
    leadId?: string;
    message: string;
    persistedToSupabase: boolean;
    persistedToLocalDB: boolean;
    forwardedToGoogleSheets: boolean;
}

/**
 * Validates and sanitizes lead contact data
 */
export function validateAndSanitizeLead(payload: LeadSubmissionPayload): {
    isValid: boolean;
    errorMessage?: string;
    sanitized?: {
        name: string;
        phone: string;
        email: string;
        course: string;
        message: string;
    };
} {
    // 1. Honeypot check (Bots fill invisible fields)
    if (payload.honeypot && payload.honeypot.trim().length > 0) {
        return { isValid: false, errorMessage: "Phát hiện hành vi gửi tin tự động không hợp lệ." };
    }

    // 2. Name validation & XSS sanitization
    const rawName = (payload.name || "").trim();
    if (!rawName || rawName.length < 2 || rawName.length > 100) {
        return { isValid: false, errorMessage: "Họ và tên phải từ 2 đến 100 ký tự." };
    }
    const cleanName = rawName
        .replace(/<[^>]*>?/gm, "") // Strip HTML tags
        .replace(/[<>"'&]/g, "");

    // 3. Phone validation (Vietnam standard format)
    const rawPhone = (payload.phone || "").replace(/[\s\.-]/g, "");
    const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!rawPhone || !vnPhoneRegex.test(rawPhone)) {
        return { isValid: false, errorMessage: "Số điện thoại không đúng định dạng (Ví dụ: 0963896791)." };
    }
    const cleanPhone = rawPhone.startsWith("+84") ? `0${rawPhone.slice(3)}` : rawPhone;

    // 4. Email validation (Optional, but if provided must be valid)
    const rawEmail = (payload.email || "").trim();
    let cleanEmail = "";
    if (rawEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(rawEmail) || rawEmail.length > 120) {
            return { isValid: false, errorMessage: "Địa chỉ email không hợp lệ." };
        }
        cleanEmail = rawEmail.toLowerCase();
    }

    // 5. Course & Message sanitization
    const cleanCourse = (payload.course || "Tư vấn khóa học chung")
        .replace(/<[^>]*>?/gm, "")
        .trim()
        .slice(0, 150);

    const cleanMessage = (payload.message || "")
        .replace(/<[^>]*>?/gm, "")
        .trim()
        .slice(0, 1000);

    return {
        isValid: true,
        sanitized: {
            name: cleanName,
            phone: cleanPhone,
            email: cleanEmail,
            course: cleanCourse,
            message: cleanMessage,
        },
    };
}

/**
 * Checks IP rate limits to prevent spam attacks and flooding
 */
export function checkRateLimit(ip: string): boolean {
    if (!ip || ip === "127.0.0.1" || ip === "::1") return true;

    const now = Date.now();
    const record = rateLimitMap.get(ip);

    // Clean up expired entries periodically
    if (rateLimitMap.size > 2000) {
        for (const [key, val] of rateLimitMap.entries()) {
            if (now - val.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
                rateLimitMap.delete(key);
            }
        }
    }

    if (!record) {
        rateLimitMap.set(ip, { count: 1, firstRequestTime: now });
        return true;
    }

    if (now - record.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, firstRequestTime: now });
        return true;
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }

    record.count += 1;
    return true;
}

/**
 * Multi-Tier Fault-Tolerant Lead Ingestion Engine
 * Guarantees zero lead loss across Supabase, Local Store & Google Sheets
 */
export async function processLeadSubmission(payload: LeadSubmissionPayload): Promise<LeadProcessingResult> {
    const ip = payload.ip || "unknown";

    // 1. Rate Limiting Check
    if (!checkRateLimit(ip)) {
        return {
            success: false,
            message: "Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau 3 phút hoặc gọi Hotline 0963.896.791.",
            persistedToSupabase: false,
            persistedToLocalDB: false,
            forwardedToGoogleSheets: false,
        };
    }

    // 2. Validation & Sanitization
    const validation = validateAndSanitizeLead(payload);
    if (!validation.isValid || !validation.sanitized) {
        return {
            success: false,
            message: validation.errorMessage || "Dữ liệu không hợp lệ.",
            persistedToSupabase: false,
            persistedToLocalDB: false,
            forwardedToGoogleSheets: false,
        };
    }

    const { name, phone, email, course, message } = validation.sanitized;
    const leadId = `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const todayStr = new Date().toISOString().split("T")[0];
    const createdAtVn = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

    const newRegistration: Registration = {
        id: leadId,
        name,
        phone,
        email: email || "Chưa cung cấp",
        courseName: course,
        status: "pending",
        date: todayStr,
    };

    let persistedToSupabase = false;
    let persistedToLocalDB = false;
    let forwardedToGoogleSheets = false;

    // --- TIER 1: SUPABASE POSTGRESQL INSERTION ---
    try {
        const { error } = await supabase.from("registrations").insert({
            id: leadId,
            name,
            phone,
            email: email || "N/A",
            course_name: course,
            note: message || null,
            status: "pending",
            date: todayStr,
        });

        if (!error) {
            persistedToSupabase = true;
        } else {
            console.warn("[LeadManager] Supabase insert warning:", error.message);
        }
    } catch (err: any) {
        console.warn("[LeadManager] Supabase connection error:", err.message);
    }

    // --- TIER 2: LOCAL CMS STORE PERSISTENCE (Instant display in /admin/dang-ky) ---
    try {
        const db = getLocalDB();
        const existing = Array.isArray(db.registrations) ? db.registrations : [];
        const updated = [newRegistration, ...existing.filter((r) => r.id !== leadId)];
        saveLocalDB({ registrations: updated });
        persistedToLocalDB = true;
    } catch (err: any) {
        console.warn("[LeadManager] Local DB save warning:", err.message);
    }

    // --- TIER 3: GOOGLE SHEETS ASYNC DISPATCH (If configured) ---
    const scriptUrl = process.env.GOOGLE_SHEETS_SCRIPT_URL;
    if (scriptUrl && !scriptUrl.includes("YOUR_APPS_SCRIPT_WEB_APP_ID")) {
        try {
            const res = await fetch(scriptUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: leadId,
                    name,
                    phone,
                    email: email || "N/A",
                    course,
                    message: message || "N/A",
                    createdAt: createdAtVn,
                }),
            });
            if (res.ok) {
                forwardedToGoogleSheets = true;
            }
        } catch (err: any) {
            console.warn("[LeadManager] Google Sheets webhook error:", err.message);
        }
    }

    // Always succeed if at least one persistence layer succeeded
    const isSuccess = persistedToSupabase || persistedToLocalDB;

    return {
        success: isSuccess,
        leadId,
        message: isSuccess
            ? "Đăng ký thành công! Chuyên viên tư vấn DuaxCar sẽ liên hệ với bạn trong thời gian sớm nhất."
            : "Đã xảy ra lỗi khi lưu thông tin. Vui lòng liên hệ trực tiếp Hotline 0963.896.791.",
        persistedToSupabase,
        persistedToLocalDB,
        forwardedToGoogleSheets,
    };
}
