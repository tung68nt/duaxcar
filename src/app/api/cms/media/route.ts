import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import { MediaItem, DEFAULT_MEDIA_ITEMS } from '@/lib/media-store';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Try fetching from supabase if table exists
        const { data, error } = await supabase
            .from('media_library')
            .select('*')
            .order('uploaded_at', { ascending: false });

        if (!error && data && data.length > 0) {
            const mapped: MediaItem[] = data.map((item: any) => ({
                id: item.id,
                name: item.name,
                url: item.url,
                type: item.type || "image",
                size: item.size || "150 KB",
                sizeBytes: item.size_bytes,
                dimensions: item.dimensions,
                uploadedAt: item.uploaded_at || new Date().toISOString().split('T')[0],
                compressed: item.compressed,
                originalSize: item.original_size
            }));
            return NextResponse.json({ media: mapped });
        }
    } catch (e) {
        console.warn("Supabase GET media error:", e);
    }

    try {
        const db = getLocalDB();
        const media = (db.media && db.media.length > 0) ? db.media : DEFAULT_MEDIA_ITEMS;
        return NextResponse.json({ media });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, item } = body;

        const db = getLocalDB();
        let currentMedia = db.media || [...DEFAULT_MEDIA_ITEMS];

        if (Array.isArray(items)) {
            currentMedia = items;
        } else if (item) {
            const existsIndex = currentMedia.findIndex(m => m.id === item.id);
            if (existsIndex >= 0) {
                currentMedia[existsIndex] = item;
            } else {
                currentMedia = [item, ...currentMedia];
            }
        }

        saveLocalDB({ media: currentMedia });

        // Attempt Supabase sync if single item
        if (item) {
            try {
                await supabase.from('media_library').upsert({
                    id: item.id,
                    name: item.name,
                    url: item.url,
                    type: item.type,
                    size: item.size,
                    size_bytes: item.sizeBytes,
                    dimensions: item.dimensions,
                    uploaded_at: item.uploadedAt,
                    compressed: item.compressed,
                    original_size: item.originalSize
                });
            } catch (e) {
                console.warn("Supabase upsert media warning:", e);
            }
        }

        return NextResponse.json({ success: true, media: currentMedia });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const idsParam = searchParams.get('ids');

        const db = getLocalDB();
        let currentMedia = db.media || [...DEFAULT_MEDIA_ITEMS];

        if (idsParam) {
            const idsToDelete = idsParam.split(',');
            currentMedia = currentMedia.filter(m => !idsToDelete.includes(m.id));
            try {
                await supabase.from('media_library').delete().in('id', idsToDelete);
            } catch {}
        } else if (id) {
            currentMedia = currentMedia.filter(m => m.id !== id);
            try {
                await supabase.from('media_library').delete().eq('id', id);
            } catch {}
        } else {
            return NextResponse.json({ error: 'Missing media ID(s)' }, { status: 400 });
        }

        saveLocalDB({ media: currentMedia });
        return NextResponse.json({ success: true, media: currentMedia });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
