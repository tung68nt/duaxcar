import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import { Course } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
            const mappedCourses: Course[] = data.map((c) => ({
                id: c.id,
                slug: c.slug,
                name: c.name,
                category: c.category,
                courseType: c.course_type,
                description: c.description,
                shortDescription: c.short_description,
                price: Number(c.price),
                contactForPrice: c.contact_for_price,
                duration: c.duration,
                maxStudents: c.max_students,
                instructor: c.instructor,
                instructorId: c.instructor_id,
                image: c.image,
                highlights: c.highlights || [],
                curriculum: c.curriculum || [],
                featured: c.featured,
                totalLessons: c.total_lessons,
                totalDuration: c.total_duration,
                accessDuration: c.access_duration,
                onlineUrl: c.online_url
            }));
            return NextResponse.json({ courses: mappedCourses });
        }
    } catch (e) {
        console.warn("Supabase GET courses error:", e);
    }

    try {
        const db = getLocalDB();
        return NextResponse.json({ courses: db.courses });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const course: Course = body.course;

        if (!course || !course.name || !course.slug) {
            return NextResponse.json({ error: 'Missing required course fields' }, { status: 400 });
        }

        const courseId = course.id || `course-${Date.now()}`;
        const finalCourse: Course = { ...course, id: courseId };

        const payload = {
            id: courseId,
            slug: finalCourse.slug,
            name: finalCourse.name,
            category: finalCourse.category,
            course_type: finalCourse.courseType,
            description: finalCourse.description,
            short_description: finalCourse.shortDescription,
            price: finalCourse.price,
            contact_for_price: finalCourse.contactForPrice || false,
            duration: finalCourse.duration,
            max_students: finalCourse.maxStudents || null,
            instructor: finalCourse.instructor,
            instructor_id: finalCourse.instructorId,
            image: finalCourse.image,
            highlights: finalCourse.highlights || [],
            curriculum: finalCourse.curriculum || [],
            featured: finalCourse.featured || false,
            total_lessons: finalCourse.totalLessons || null,
            total_duration: finalCourse.totalDuration || null,
            access_duration: finalCourse.accessDuration || null,
            online_url: finalCourse.onlineUrl || null
        };

        const { error: sbError } = await supabase.from('courses').upsert(payload);
        if (sbError) {
            console.error("Supabase course upsert error:", sbError);
        }

        const db = getLocalDB();
        const existingIndex = db.courses.findIndex(c => c.id === courseId);
        let updatedCourses: Course[] = [];
        if (existingIndex >= 0) {
            updatedCourses = [...db.courses];
            updatedCourses[existingIndex] = finalCourse;
        } else {
            updatedCourses = [finalCourse, ...db.courses];
        }
        saveLocalDB({ courses: updatedCourses });

        // Purge Next.js page cache
        try {
            revalidatePath('/');
            revalidatePath('/khoa-hoc');
            revalidatePath(`/khoa-hoc/${finalCourse.slug}`);
        } catch {}

        return NextResponse.json({ success: true, course: finalCourse });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing course ID' }, { status: 400 });
        }

        const { error: sbError } = await supabase.from('courses').delete().eq('id', id);
        if (sbError) {
            console.error("Supabase course delete error:", sbError);
        }

        const db = getLocalDB();
        const updatedCourses = db.courses.filter(c => c.id !== id);
        saveLocalDB({ courses: updatedCourses });

        try {
            revalidatePath('/');
            revalidatePath('/khoa-hoc');
        } catch {}

        return NextResponse.json({ success: true, courses: updatedCourses });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
