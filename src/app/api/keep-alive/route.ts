import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const startTime = Date.now();

        // Query a lightweight record to generate activity in Supabase
        const { data, error } = await supabase
            .from("settings")
            .select("key")
            .limit(1);

        if (error) {
            console.error("[Keep-Alive] Supabase ping failed:", error);
            return NextResponse.json(
                {
                    status: "error",
                    message: "Failed to ping Supabase",
                    error: error.message,
                    timestamp: new Date().toISOString(),
                },
                { status: 500 }
            );
        }

        const duration = Date.now() - startTime;

        return NextResponse.json({
            status: "success",
            message: "Supabase database pinged successfully to prevent auto-pause",
            recordsFound: data?.length ?? 0,
            durationMs: duration,
            timestamp: new Date().toISOString(),
        });
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json(
            {
                status: "error",
                message: errorMsg,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
