"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { 
    getOrCreateVisitorId, 
    getOrCreateSessionId, 
    captureUtmParameters, 
    appendJourneyHistory,
    JourneyHistoryItem
} from "@/lib/client-tracker";

/**
 * Nhận diện loại trang và slug tương ứng từ URL pathname
 */
function parsePageContext(pathname: string): {
    pageType: JourneyHistoryItem["type"];
    targetSlug?: string;
} {
    if (pathname === "/") {
        return { pageType: "home" };
    }
    if (pathname.startsWith("/khoa-hoc/")) {
        const slug = pathname.replace("/khoa-hoc/", "").split("/")[0];
        return { pageType: "course", targetSlug: slug };
    }
    if (pathname === "/khoa-hoc") {
        return { pageType: "course" };
    }
    if (pathname.startsWith("/tin-tuc/")) {
        const slug = pathname.replace("/tin-tuc/", "").split("/")[0];
        return { pageType: "blog", targetSlug: slug };
    }
    if (pathname === "/tin-tuc") {
        return { pageType: "blog" };
    }
    if (pathname === "/lich-khai-giang") {
        return { pageType: "schedule" };
    }
    if (pathname === "/lien-he") {
        return { pageType: "contact" };
    }
    return { pageType: "other" };
}

/**
 * Đoán thiết bị client
 */
function detectDeviceType(): "mobile" | "desktop" | "tablet" {
    if (typeof window === "undefined") return "desktop";
    const ua = navigator.userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
        return "tablet";
    }
    if (/mobile|iphone|android|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
        return "mobile";
    }
    return "desktop";
}

/**
 * Đoán trình duyệt client
 */
function detectBrowser(): string {
    if (typeof window === "undefined") return "Unknown";
    const ua = navigator.userAgent;
    if (ua.includes("Zalo")) return "Zalo App";
    if (ua.includes("FBAN") || ua.includes("FBAV")) return "Facebook App";
    if (ua.includes("TikTok")) return "TikTok App";
    if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Firefox")) return "Firefox";
    return "Other";
}

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const enterTimeRef = useRef<number>(Date.now());
    const lastTrackedPathRef = useRef<string>("");

    useEffect(() => {
        // Không theo dõi các trang Admin và Login để tránh loãng số liệu khách hàng
        if (!pathname || pathname.startsWith("/admin") || pathname === "/login") {
            return;
        }

        // Tránh tracking lặp lại cùng một pathname khi chỉ thay đổi hash
        if (lastTrackedPathRef.current === pathname) {
            return;
        }
        lastTrackedPathRef.current = pathname;
        enterTimeRef.current = Date.now();

        // 1. Khởi tạo / lấy Visitor ID & Session ID
        const visitorId = getOrCreateVisitorId();
        const sessionId = getOrCreateSessionId();

        // 2. Bắt UTM params từ query string
        const utmParams = captureUtmParameters(searchParams);

        // 3. Phân tích loại trang và thông tin
        const { pageType, targetSlug } = parsePageContext(pathname);
        const pageTitle = document.title || "DuaxCar Kitchen";
        const referrer = document.referrer || "direct";

        // 4. Lưu lại lịch sử hành trình trên thiết bị
        appendJourneyHistory({
            path: pathname,
            title: pageTitle,
            type: pageType,
            targetSlug,
            timestamp: new Date().toISOString()
        });

        // 5. Gửi sự kiện tracking lên Server
        const trackPayload = {
            visitorId,
            sessionId,
            path: pathname,
            title: pageTitle,
            pageType,
            targetSlug,
            referrer,
            utmSource: utmParams.source,
            utmMedium: utmParams.medium,
            utmCampaign: utmParams.campaign,
            device: detectDeviceType(),
            browser: detectBrowser()
        };

        // Dùng non-blocking fetch không làm chậm giao diện
        try {
            fetch("/api/analytics/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(trackPayload),
                keepalive: true
            }).catch(() => {});
        } catch {}

        // Ghi nhận thời gian người dùng đọc trang khi chuyển trang hoặc rời website
        return () => {
            const durationSeconds = Math.max(1, Math.round((Date.now() - enterTimeRef.current) / 1000));
            // Nếu đọc trên 5 giây, gửi cập nhật duration
            if (durationSeconds >= 5) {
                try {
                    const durationPayload = JSON.stringify({
                        visitorId,
                        sessionId,
                        path: pathname,
                        durationSeconds
                    });
                    if (navigator.sendBeacon) {
                        navigator.sendBeacon("/api/analytics/heartbeat", durationPayload);
                    }
                } catch {}
            }
        };
    }, [pathname, searchParams]);

    return null;
}
