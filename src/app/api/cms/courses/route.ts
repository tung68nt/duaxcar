import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import { Course } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { clearCMSCache } from '@/lib/cms';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    const noCacheHeaders = {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    };

    try {
        const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
            let localCourses: Course[] = [];
            try {
                const db = getLocalDB();
                localCourses = db.courses || [];
            } catch {}

            const mappedCourses: Course[] = data.map((c) => {
                const local = localCourses.find(x => x.id === c.id || x.slug === c.slug);
                return {
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
                    image: c.image || local?.image,
                    gallery: (c.gallery && Array.isArray(c.gallery) && c.gallery.length > 0) ? c.gallery : (local?.gallery || []),
                    highlights: c.highlights || local?.highlights || [],
                    curriculum: c.curriculum || local?.curriculum || [],
                    featured: c.featured,
                    totalLessons: c.total_lessons,
                    totalDuration: c.total_duration,
                    accessDuration: c.access_duration,
                    onlineUrl: c.online_url,
                    videoUrl: c.video_url || local?.videoUrl
                };
            });
            return NextResponse.json({ courses: mappedCourses }, { headers: noCacheHeaders });
        }
    } catch (e) {
        console.warn("Supabase GET courses error:", e);
    }

    try {
        const db = getLocalDB();
        return NextResponse.json({ courses: db.courses }, { headers: noCacheHeaders });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500, headers: noCacheHeaders });
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

        const payload: any = {
            id: courseId,
            slug: finalCourse.slug,
            name: finalCourse.name,
            category: finalCourse.category || 'mon-an-sang',
            course_type: finalCourse.courseType || 'onsite',
            description: finalCourse.description || '',
            short_description: finalCourse.shortDescription || finalCourse.name || '',
            price: Number(finalCourse.price) || 0,
            contact_for_price: Boolean(finalCourse.contactForPrice),
            duration: finalCourse.duration || 'Theo lộ trình',
            max_students: finalCourse.maxStudents ? Number(finalCourse.maxStudents) : null,
            instructor: finalCourse.instructor || 'Chuyên gia DuaxCar Kitchen',
            instructor_id: finalCourse.instructorId || 'nguyen-huu-tho',
            image: finalCourse.image || '/images/courses/pho-bo.jpg',
            gallery: finalCourse.gallery || [],
            video_url: finalCourse.videoUrl || null,
            highlights: finalCourse.highlights || [],
            curriculum: finalCourse.curriculum || [],
            featured: Boolean(finalCourse.featured),
            total_lessons: finalCourse.totalLessons ? Number(finalCourse.totalLessons) : null,
            total_duration: finalCourse.totalDuration || null,
            access_duration: finalCourse.accessDuration || null,
            online_url: finalCourse.onlineUrl || null
        };

        let supabaseWarning: string | undefined;
        try {
            const { error: sbError } = await supabase.from('courses').upsert(payload);
            if (sbError) {
                // If error is related to columns, attempt upsert without gallery/video_url as fallback
                if (sbError.message.includes('gallery') || sbError.message.includes('video_url')) {
                    const fallbackPayload = { ...payload };
                    delete fallbackPayload.gallery;
                    delete fallbackPayload.video_url;
                    await supabase.from('courses').upsert(fallbackPayload);
                } else {
                    console.error("Supabase course upsert error:", sbError);
                    supabaseWarning = `Supabase sync warning: ${sbError.message}`;
                }
            }
        } catch (sbErr) {
            console.error("Supabase course upsert exception:", sbErr);
            supabaseWarning = "Supabase sync warning: connection error";
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
        const saveResult = saveLocalDB({ courses: updatedCourses });

        if (!saveResult && supabaseWarning) {
            return NextResponse.json({ error: 'Failed to save to both Supabase and local DB' }, { status: 500 });
        }

        // Purge memory and Next.js page cache
        clearCMSCache('courses');
        try {
            revalidatePath('/');
            revalidatePath('/khoa-hoc');
            revalidatePath(`/khoa-hoc/${finalCourse.slug}`);
        } catch {}

        return NextResponse.json({ 
            success: true, 
            course: finalCourse,
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
            return NextResponse.json({ error: 'Missing course ID' }, { status: 400 });
        }

        const { error: sbError } = await supabase.from('courses').delete().eq('id', id);
        if (sbError) {
            console.error("Supabase course delete error:", sbError);
        }

        const db = getLocalDB();
        const updatedCourses = db.courses.filter(c => c.id !== id);
        saveLocalDB({ courses: updatedCourses });

        clearCMSCache('courses');
        try {
            revalidatePath('/');
            revalidatePath('/khoa-hoc');
        } catch {}

        return NextResponse.json({ success: true, courses: updatedCourses });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
