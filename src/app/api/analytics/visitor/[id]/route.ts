import { NextResponse } from "next/server";
import { getVisitorJourney } from "@/lib/analytics";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const url = new URL(request.url);
        const ip = url.searchParams.get("ip") || undefined;

        const journey = getVisitorJourney(id, ip);

        return NextResponse.json({
            success: true,
            journey
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Lỗi tải hành trình khách hàng." },
            { status: 500 }
        );
    }
}
