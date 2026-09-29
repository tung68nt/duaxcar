import { NextResponse } from 'next/server';
import { processLeadSubmission, LeadSubmissionPayload } from '@/lib/lead-manager';
import { resolveGeoLocation, extractClientIp } from '@/lib/geo-ip';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Extract client IP address for anti-abuse and rate limiting
        const clientIp = extractClientIp(request.headers);
        const geo = await resolveGeoLocation(request.headers, clientIp);

        // Extract Visitor ID from body or cookie
        let visitorId = body.visitorId;
        if (!visitorId) {
            const cookieHeader = request.headers.get("cookie") || "";
            const match = cookieHeader.match(/(^|;\s*)duaxcar_vid=([^;]*)/);
            if (match) visitorId = decodeURIComponent(match[2]);
        }

        const payload: LeadSubmissionPayload = {
            name: body.name,
            phone: body.phone,
            email: body.email,
            course: body.course,
            message: body.message || body.note,
            honeypot: body.honeypot || body._hp_company,
            ip: clientIp,
            visitorId,
            city: geo.city,
            firstSeenAt: body.firstSeenAt,
            clientJourney: body.clientJourney,
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
