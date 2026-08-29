import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB, Registration } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Try fetching latest registrations from Supabase
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
            const mapped: Registration[] = data.map(r => ({
                id: r.id,
                name: r.name,
                phone: r.phone,
                email: r.email,
                courseName: r.course_name,
                status: r.status as any,
                date: r.date || (r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
            }));

            // Sync with local DB
            try {
                saveLocalDB({ registrations: mapped });
            } catch {}

            return NextResponse.json({ registrations: mapped });
        }
    } catch (err) {
        console.warn("[API Registrations GET] Supabase fallback to local DB:", err);
    }

    // Fallback to local file store
    try {
        const db = getLocalDB();
        return NextResponse.json({ registrations: db.registrations || [] });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const registration: Registration = body.registration;

        if (!registration) {
            return NextResponse.json({ error: 'Missing registration payload' }, { status: 400 });
        }

        const db = getLocalDB();
        const existingIndex = db.registrations.findIndex(r => r.id === registration.id);

        let updated: Registration[] = [];
        if (existingIndex >= 0) {
            updated = [...db.registrations];
            updated[existingIndex] = { ...updated[existingIndex], ...registration };
        } else {
            updated = [{ ...registration, id: registration.id || `reg-${Date.now()}` }, ...db.registrations];
        }

        const saveResult = saveLocalDB({ registrations: updated });

        // Sync with Supabase
        let supabaseWarning: string | undefined;
        try {
            const { error: sbError } = await supabase.from('registrations').upsert({
                id: registration.id,
                name: registration.name,
                phone: registration.phone,
                email: registration.email,
                course_name: registration.courseName,
                status: registration.status,
                date: registration.date,
            });
            if (sbError) {
                console.error("[API Registrations POST] Supabase upsert error:", sbError);
                supabaseWarning = `Supabase sync failed: ${sbError.message}`;
            }
        } catch (sbErr) {
            console.error("[API Registrations POST] Supabase upsert exception:", sbErr);
            supabaseWarning = "Supabase sync failed: connection error";
        }

        if (!saveResult && supabaseWarning) {
            return NextResponse.json({ error: 'Failed to save to both Supabase and local DB' }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            registrations: updated,
            ...(supabaseWarning ? { warning: supabaseWarning } : {})
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 });
        }

        const db = getLocalDB();
        const updated = db.registrations.filter(r => r.id !== id);
        saveLocalDB({ registrations: updated });

        // Delete from Supabase
        let supabaseWarning: string | undefined;
        try {
            const { error: sbError } = await supabase.from('registrations').delete().eq('id', id);
            if (sbError) {
                console.error("[API Registrations DELETE] Supabase delete error:", sbError);
                supabaseWarning = `Supabase sync failed: ${sbError.message}`;
            }
        } catch (sbErr) {
            console.error("[API Registrations DELETE] Supabase delete exception:", sbErr);
            supabaseWarning = "Supabase sync failed: connection error";
        }

        return NextResponse.json({ 
            success: true, 
            registrations: updated,
            ...(supabaseWarning ? { warning: supabaseWarning } : {})
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
