import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB, FAQItem } from '@/lib/db';

export async function GET() {
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

        return NextResponse.json({ success: true, faqs: updatedFaqs });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
