import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB, Registration } from '@/lib/db';

export async function GET() {
    try {
        const db = getLocalDB();
        return NextResponse.json({ registrations: db.registrations });
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

        saveLocalDB({ registrations: updated });
        return NextResponse.json({ success: true, registrations: updated });
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

        return NextResponse.json({ success: true, registrations: updated });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
