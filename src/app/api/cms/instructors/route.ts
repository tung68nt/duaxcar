import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import { Instructor } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase.from('instructors').select('*');
        if (!error && data && data.length > 0) {
            const mappedInstructors: Instructor[] = data.map((i) => ({
                id: i.id,
                name: i.name,
                role: i.role,
                title: i.title,
                image: i.image,
                bio: i.bio,
                fullBio: i.full_bio,
                achievements: i.achievements || [],
                courses: i.courses || [],
                quote: i.quote,
                experience: i.experience
            }));
            return NextResponse.json({ instructors: mappedInstructors });
        }
    } catch (e) {
        console.warn("Supabase GET instructors error:", e);
    }

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

        const instId = instructor.id || `inst-${Date.now()}`;
        const finalInstructor: Instructor = { ...instructor, id: instId };

        const payload = {
            id: instId,
            name: finalInstructor.name,
            role: finalInstructor.role || 'Giảng viên',
            title: finalInstructor.title || 'Chuyên gia ẩm thực DuaxCar Kitchen',
            image: finalInstructor.image || '/images/instructors/nguyen-huu-tho-v3.jpg',
            bio: finalInstructor.bio || '',
            full_bio: finalInstructor.fullBio || null,
            achievements: finalInstructor.achievements || [],
            courses: finalInstructor.courses || [],
            quote: finalInstructor.quote || null,
            experience: finalInstructor.experience || null
        };

        let supabaseWarning: string | undefined;
        try {
            const { error: sbError } = await supabase.from('instructors').upsert(payload);
            if (sbError) {
                console.error("Supabase instructor upsert error:", sbError);
                supabaseWarning = `Supabase sync failed: ${sbError.message}`;
            }
        } catch (sbErr) {
            console.error("Supabase instructor upsert exception:", sbErr);
            supabaseWarning = "Supabase sync failed: connection error";
        }

        const db = getLocalDB();
        const existingIndex = db.instructors.findIndex(i => i.id === instId);
        let updatedInstructors: Instructor[] = [];
        if (existingIndex >= 0) {
            updatedInstructors = [...db.instructors];
            updatedInstructors[existingIndex] = finalInstructor;
        } else {
            updatedInstructors = [finalInstructor, ...db.instructors];
        }
        const saveResult = saveLocalDB({ instructors: updatedInstructors });

        if (!saveResult && supabaseWarning) {
            return NextResponse.json({ error: 'Failed to save to both Supabase and local DB' }, { status: 500 });
        }

        // Purge Next.js cache
        try {
            revalidatePath('/');
            revalidatePath('/ve-duaxcar');
        } catch {}

        return NextResponse.json({ 
            success: true, 
            instructor: finalInstructor,
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
            return NextResponse.json({ error: 'Missing instructor ID' }, { status: 400 });
        }

        let supabaseWarning: string | undefined;
        try {
            const { error: sbError } = await supabase.from('instructors').delete().eq('id', id);
            if (sbError) {
                console.error("Supabase instructor delete error:", sbError);
                supabaseWarning = `Supabase sync failed: ${sbError.message}`;
            }
        } catch (sbErr) {
            console.error("Supabase instructor delete exception:", sbErr);
            supabaseWarning = "Supabase sync failed: connection error";
        }

        const db = getLocalDB();
        const updatedInstructors = db.instructors.filter(i => i.id !== id);
        saveLocalDB({ instructors: updatedInstructors });

        try {
            revalidatePath('/');
            revalidatePath('/ve-duaxcar');
        } catch {}

        return NextResponse.json({ 
            success: true, 
            instructors: updatedInstructors,
            ...(supabaseWarning ? { warning: supabaseWarning } : {})
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
