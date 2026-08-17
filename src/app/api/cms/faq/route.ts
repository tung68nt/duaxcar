import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getLocalDB, saveLocalDB, FAQItem } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase.from('site_settings').select('data').eq('id', 'default_faqs').single();
        if (!error && data && Array.isArray(data.data)) {
            return NextResponse.json({ faqs: data.data });
        }
    } catch {}

    try {
        const db = getLocalDB();
        return NextResponse.json({ faqs: db.faqs });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const faq: FAQItem = body.faq;

        if (!faq || !faq.title || !faq.content) {
            return NextResponse.json({ error: 'Missing FAQ title or content' }, { status: 400 });
        }

        const db = getLocalDB();
        const existingIndex = db.faqs.findIndex(f => f.id === faq.id);
        
        let updatedFaqs: FAQItem[] = [];
        if (existingIndex >= 0) {
            updatedFaqs = [...db.faqs];
            updatedFaqs[existingIndex] = { ...updatedFaqs[existingIndex], ...faq };
        } else {
            updatedFaqs = [{ ...faq, id: faq.id || `faq-${Date.now()}` }, ...db.faqs];
        }

        saveLocalDB({ faqs: updatedFaqs });

        try {
            await supabase.from('site_settings').upsert({ id: 'default_faqs', data: updatedFaqs });
        } catch {}

        try {
            revalidatePath('/');
            revalidatePath('/faq');
        } catch {}

        return NextResponse.json({ success: true, faqs: updatedFaqs });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing FAQ ID' }, { status: 400 });
        }

        const db = getLocalDB();
        const updatedFaqs = db.faqs.filter(f => f.id !== id);
        saveLocalDB({ faqs: updatedFaqs });

        try {
            await supabase.from('site_settings').upsert({ id: 'default_faqs', data: updatedFaqs });
        } catch {}

        try {
            revalidatePath('/');
            revalidatePath('/faq');
        } catch {}

        return NextResponse.json({ success: true, faqs: updatedFaqs });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
