import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return new NextResponse('Bad Request', { status: 400 });
        }

        // Clean filename and extract base ID
        const cleanId = id.trim();
        const baseId = cleanId.replace(/\.[^/.]+$/, "");

        // 1. Try fetching from Supabase site_settings
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('data')
                .eq('id', baseId)
                .single();

            if (!error && data && data.data && data.data.base64) {
                const buffer = Buffer.from(data.data.base64, 'base64');
                const mimeType = data.data.mimeType || 'image/webp';
                return new NextResponse(buffer, {
                    headers: {
                        'Content-Type': mimeType,
                        'Cache-Control': 'public, max-age=31536000, immutable'
                    }
                });
            }
        } catch (sbErr) {
            console.warn(`Supabase image fetch error for ${baseId}:`, sbErr);
        }

        // 2. Fallback to local disk if running locally
        try {
            const localPath = path.join(process.cwd(), 'public', 'uploads', cleanId);
            if (fs.existsSync(localPath)) {
                const fileBuffer = fs.readFileSync(localPath);
                const ext = cleanId.split('.').pop()?.toLowerCase() || 'webp';
                const mimeMap: Record<string, string> = {
                    webp: 'image/webp',
                    jpg: 'image/jpeg',
                    jpeg: 'image/jpeg',
                    png: 'image/png',
                    gif: 'image/gif',
                    svg: 'image/svg+xml',
                    mp4: 'video/mp4'
                };
                return new NextResponse(fileBuffer, {
                    headers: {
                        'Content-Type': mimeMap[ext] || 'image/webp',
                        'Cache-Control': 'public, max-age=31536000, immutable'
                    }
                });
            }
        } catch {}

        return new NextResponse('Image not found', { status: 404 });
    } catch (err: any) {
        return new NextResponse(err?.message || 'Server error', { status: 500 });
    }
}
