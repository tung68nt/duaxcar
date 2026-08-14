import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import { Course } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export async function GET() {
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

        const db = getLocalDB();
        const existingIndex = db.courses.findIndex(c => c.id === course.id);
        
        let updatedCourses: Course[] = [];
        if (existingIndex >= 0) {
            updatedCourses = [...db.courses];
            updatedCourses[existingIndex] = { ...updatedCourses[existingIndex], ...course };
        } else {
            updatedCourses = [{ ...course, id: course.id || `course-${Date.now()}` }, ...db.courses];
        }

        saveLocalDB({ courses: updatedCourses });

        // Optional asynchronous sync to Supabase without blocking or throwing
        try {
            const payload = {
                id: course.id,
                slug: course.slug,
                name: course.name,
                category: course.category,
                course_type: course.courseType,
                description: course.description,
                short_description: course.shortDescription,
                price: course.price,
                contact_for_price: course.contactForPrice || false,
                duration: course.duration,
                max_students: course.maxStudents || null,
                instructor: course.instructor,
                instructor_id: course.instructorId,
                image: course.image,
                highlights: course.highlights || [],
                curriculum: course.curriculum || [],
                featured: course.featured || false,
                total_lessons: course.totalLessons || null,
                total_duration: course.totalDuration || null,
                access_duration: course.accessDuration || null,
                online_url: course.onlineUrl || null
            };
            await supabase.from('courses').upsert(payload);
        } catch {
            // ignore Supabase offline error
        }

        return NextResponse.json({ success: true, courses: updatedCourses });
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

        const db = getLocalDB();
        const updatedCourses = db.courses.filter(c => c.id !== id);
        saveLocalDB({ courses: updatedCourses });

        try {
            await supabase.from('courses').delete().eq('id', id);
        } catch {}

        return NextResponse.json({ success: true, courses: updatedCourses });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
