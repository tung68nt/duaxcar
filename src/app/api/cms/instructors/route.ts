import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import { Instructor } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const db = getLocalDB();
        return NextResponse.json({ instructors: db.instructors });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const instructor: Instructor = body.instructor;

        if (!instructor || !instructor.name) {
            return NextResponse.json({ error: 'Missing instructor name' }, { status: 400 });
        }

        const db = getLocalDB();
        const existingIndex = db.instructors.findIndex(i => i.id === instructor.id);
        
        let updatedInstructors: Instructor[] = [];
        if (existingIndex >= 0) {
            updatedInstructors = [...db.instructors];
            updatedInstructors[existingIndex] = { ...updatedInstructors[existingIndex], ...instructor };
        } else {
            updatedInstructors = [{ ...instructor, id: instructor.id || `inst-${Date.now()}` }, ...db.instructors];
        }

        saveLocalDB({ instructors: updatedInstructors });

        try {
            const payload = {
                id: instructor.id,
                name: instructor.name,
                role: instructor.role,
                title: instructor.title,
                image: instructor.image,
                bio: instructor.bio,
                full_bio: instructor.fullBio || null,
                achievements: instructor.achievements || [],
                courses: instructor.courses || [],
                quote: instructor.quote || null,
                experience: instructor.experience || null
            };
            await supabase.from('instructors').upsert(payload);
        } catch {}

        return NextResponse.json({ success: true, instructors: updatedInstructors });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing instructor ID' }, { status: 400 });
        }

        const db = getLocalDB();
        const updatedInstructors = db.instructors.filter(i => i.id !== id);
        saveLocalDB({ instructors: updatedInstructors });

        try {
            await supabase.from('instructors').delete().eq('id', id);
        } catch {}

        return NextResponse.json({ success: true, instructors: updatedInstructors });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
