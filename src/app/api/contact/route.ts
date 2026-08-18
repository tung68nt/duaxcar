import { NextResponse } from 'next/server';
import { processLeadSubmission, LeadSubmissionPayload } from '@/lib/lead-manager';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Extract client IP address for anti-abuse and rate limiting
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

        const payload: LeadSubmissionPayload = {
            name: body.name,
            phone: body.phone,
            email: body.email,
            course: body.course,
            message: body.message,
            honeypot: body.honeypot || body._hp_company,
            ip: clientIp,
        };

        const result = await processLeadSubmission(payload);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            leadId: result.leadId,
            message: result.message,
            meta: {
                persistedToSupabase: result.persistedToSupabase,
                persistedToLocalDB: result.persistedToLocalDB,
                forwardedToGoogleSheets: result.forwardedToGoogleSheets,
            },
        });
    } catch (error: any) {
        console.error('[API /api/contact] Critical server error:', error);
        return NextResponse.json(
            { error: 'Hệ thống đang bận. Vui lòng liên hệ Hotline 0963.896.791 để được hỗ trợ ngay lập tức.' },
            { status: 500 }
        );
    }
}
