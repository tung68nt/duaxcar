import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB, SiteSettings } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const db = getLocalDB();
        return NextResponse.json({ settings: db.settings });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const settings: SiteSettings = body.settings;

        if (!settings) {
            return NextResponse.json({ error: 'Missing settings payload' }, { status: 400 });
        }

        saveLocalDB({ settings });

        try {
            await supabase.from('site_settings').upsert({ id: 'default', data: settings });
        } catch {}

        return NextResponse.json({ success: true, settings });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
