import { NextResponse } from "next/server";
import { getVisitorJourneyAsync } from "@/lib/analytics";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const url = new URL(request.url);
        const ip = url.searchParams.get("ip") || undefined;

        const journey = await getVisitorJourneyAsync(id, ip);

        return NextResponse.json({
            success: true,
            journey
        }, {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
            }
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Lỗi tải hành trình khách hàng." },
            { status: 500 }
        );
    }
}
