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

import { getDetailedDeviceInfo } from "@/lib/device-detector";

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

        // 5. Thu thập thông tin chi tiết phần cứng & hệ điều hành (Mobile iOS/Android Model, PC/Mac)
        const sendTrack = async () => {
            const deviceInfo = getDetailedDeviceInfo();

            // Nếu trình duyệt hỗ trợ Client Hints (Android Chrome), lấy model thực tế thay vì bị giảm lược "K"
            if (typeof navigator !== "undefined" && (navigator as any).userAgentData?.getHighEntropyValues) {
                try {
                    const uach = await (navigator as any).userAgentData.getHighEntropyValues(["model"]);
                    if (uach?.model && uach.model !== "K" && uach.model.trim() !== "") {
                        deviceInfo.deviceModel = uach.model;
                        deviceInfo.hardwareSummary = `${uach.model} • ${deviceInfo.os}`;
                    }
                } catch {}
            }

            // 6. Gửi sự kiện tracking lên Server
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
                device: deviceInfo.deviceType,
                deviceModel: deviceInfo.deviceModel,
                os: deviceInfo.os,
                browser: deviceInfo.browser,
                screenResolution: deviceInfo.screenResolution,
                hardwareSummary: deviceInfo.hardwareSummary
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
        };

        sendTrack();

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
