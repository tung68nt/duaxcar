import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getLocalDB, saveLocalDB, SiteSettings } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'default').single();
        if (!error && data && data.data) {
            return NextResponse.json({ settings: data.data });
        }
    } catch (e) {
        console.warn("Supabase GET site_settings error:", e);
    }

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

        let supabaseWarning: string | undefined;
        try {
            const { error: sbError } = await supabase.from('site_settings').upsert({ id: 'default', data: settings });
            if (sbError) {
                console.error("Supabase site_settings upsert error:", sbError);
                supabaseWarning = `Supabase sync failed: ${sbError.message}`;
            }
        } catch (sbErr) {
            console.error("Supabase site_settings upsert exception:", sbErr);
            supabaseWarning = "Supabase sync failed: connection error";
        }

        const saveResult = saveLocalDB({ settings });

        if (!saveResult && supabaseWarning) {
            return NextResponse.json({ error: 'Failed to save to both Supabase and local DB' }, { status: 500 });
        }

        try {
            revalidatePath('/');
            revalidatePath('/lien-he');
            revalidatePath('/ve-duaxcar');
        } catch {}

        return NextResponse.json({ 
            success: true, 
            settings,
            ...(supabaseWarning ? { warning: supabaseWarning } : {})
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
