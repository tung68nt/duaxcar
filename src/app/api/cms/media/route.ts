import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import { MediaItem, DEFAULT_MEDIA_ITEMS } from '@/lib/media-store';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Try fetching from Supabase site_settings (media_data)
        const { data, error } = await supabase
            .from('site_settings')
            .select('data')
            .eq('id', 'media_data')
            .single();

        if (!error && data && Array.isArray(data.data) && data.data.length > 0) {
            return NextResponse.json({ media: data.data });
        }
    } catch (e) {
        console.warn("Supabase GET media_data error:", e);
    }

    // 2. Fallback to local file store
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

        let currentMedia: MediaItem[] = [];

        // 1. Load current media from Supabase site_settings
        try {
            const { data } = await supabase
                .from('site_settings')
                .select('data')
                .eq('id', 'media_data')
                .single();
            if (data && Array.isArray(data.data)) {
                currentMedia = data.data;
            }
        } catch {}

        if (currentMedia.length === 0) {
            try {
                const db = getLocalDB();
                currentMedia = db.media || [...DEFAULT_MEDIA_ITEMS];
            } catch {}
        }

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

        // 2. Save to Supabase site_settings
        try {
            await supabase.from('site_settings').upsert({
                id: 'media_data',
                data: currentMedia,
                updated_at: new Date().toISOString()
            });
        } catch (e) {
            console.warn("Supabase upsert media_data warning:", e);
        }

        // 3. Save to local DB as backup
        try {
            saveLocalDB({ media: currentMedia });
        } catch {}

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

        let currentMedia: MediaItem[] = [];
        try {
            const { data } = await supabase
                .from('site_settings')
                .select('data')
                .eq('id', 'media_data')
                .single();
            if (data && Array.isArray(data.data)) {
                currentMedia = data.data;
            }
        } catch {}

        if (currentMedia.length === 0) {
            try {
                const db = getLocalDB();
                currentMedia = db.media || [...DEFAULT_MEDIA_ITEMS];
            } catch {}
        }

        if (idsParam) {
            const idsToDelete = idsParam.split(',').map(s => s.trim()).filter(Boolean);
            currentMedia = currentMedia.filter(m => !idsToDelete.includes(m.id));
        } else if (id) {
            currentMedia = currentMedia.filter(m => m.id !== id);
        }

        // Save to Supabase
        try {
            await supabase.from('site_settings').upsert({
                id: 'media_data',
                data: currentMedia,
                updated_at: new Date().toISOString()
            });
        } catch (e) {
            console.warn("Supabase delete media_data warning:", e);
        }

        // Save to local DB
        try {
            saveLocalDB({ media: currentMedia });
        } catch {}

        return NextResponse.json({ success: true, media: currentMedia });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
