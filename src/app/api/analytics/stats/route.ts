import { NextResponse } from "next/server";
import { getAnalyticsDashboardAsync } from "@/lib/analytics";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const rangeParam = url.searchParams.get("range") as "today" | "7d" | "30d" | "all" | null;
        const validRange = rangeParam && ["today", "7d", "30d", "all"].includes(rangeParam) ? rangeParam : "7d";

        const stats = await getAnalyticsDashboardAsync(validRange);
        return NextResponse.json({
            success: true,
            stats
        }, {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
            }
        });
    } catch (error: any) {
        console.error("[API /api/analytics/stats] Error:", error);
        return NextResponse.json(
            { error: "Lỗi tải dữ liệu thống kê." },
            { status: 500 }
        );
    }
}
