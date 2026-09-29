import { NextResponse } from "next/server";
import { getAnalyticsStore, saveAnalyticsStore } from "@/lib/analytics";

export async function POST(request: Request) {
    try {
        let body: any = {};
        const contentType = request.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            body = await request.json();
        } else {
            const text = await request.text();
            try {
                body = JSON.parse(text);
            } catch {}
        }

        const { visitorId, path, durationSeconds } = body;
        if (visitorId && path && durationSeconds) {
            const store = getAnalyticsStore();
            // Cập nhật duration cho pageview gần nhất tương ứng
            const pvs = [...store.pageviews];
            for (let i = pvs.length - 1; i >= 0; i--) {
                if (pvs[i].visitorId === visitorId && pvs[i].path === path) {
                    pvs[i].durationSeconds = Math.min(3600, (pvs[i].durationSeconds || 0) + Number(durationSeconds));
                    saveAnalyticsStore({ pageviews: pvs });
                    break;
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false });
    }
}
