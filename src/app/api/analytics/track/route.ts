import { NextResponse } from "next/server";
import { recordPageview } from "@/lib/analytics";
import { resolveGeoLocation, extractClientIp } from "@/lib/geo-ip";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Phân giải IP và Vị trí Tỉnh / Thành phố
        const clientIp = extractClientIp(request.headers);
        const geo = await resolveGeoLocation(request.headers, clientIp);

        // 2. Ghi nhận lượt xem trang vào hệ thống
        await recordPageview({
            visitorId: body.visitorId || `anon-${Date.now()}`,
            sessionId: body.sessionId || `sess-${Date.now()}`,
            ip: clientIp,
            city: geo.city,
            country: geo.country,
            path: body.path || "/",
            title: body.title || "DuaxCar Kitchen",
            pageType: body.pageType || "other",
            targetSlug: body.targetSlug,
            targetName: body.targetName,
            referrer: body.referrer,
            utmSource: body.utmSource,
            utmMedium: body.utmMedium,
            utmCampaign: body.utmCampaign,
            device: body.device || "desktop",
            deviceModel: body.deviceModel,
            os: body.os,
            browser: body.browser || "Unknown",
            screenResolution: body.screenResolution,
            hardwareSummary: body.hardwareSummary,
            durationSeconds: 15
        });

        return NextResponse.json({
            success: true,
            geo: {
                city: geo.city,
                region: geo.region,
                country: geo.country,
                ip: clientIp
            }
        });
    } catch (error: any) {
        console.warn("[API /api/analytics/track] Tracking error:", error);
        return NextResponse.json({ success: false }, { status: 200 }); // Luôn trả về 200 để không ảnh hưởng client
    }
}
