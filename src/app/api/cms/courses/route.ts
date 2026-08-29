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

    // 1. Try fetching full course data from Supabase site_settings (authoritative full JSON store)
    try {
        const { data: settingData, error: settingError } = await supabase
            .from('site_settings')
            .select('data')
            .eq('id', 'courses_data')
            .single();

        if (!settingError && settingData && Array.isArray(settingData.data) && settingData.data.length > 0) {
            return NextResponse.json({ courses: settingData.data }, { headers: noCacheHeaders });
        }
    } catch (e) {
        console.warn("Supabase courses_data fetch error:", e);
    }

    // 2. Fallback to Supabase relational courses table
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
                    image: local?.image || c.image,
                    gallery: (local?.gallery && local.gallery.length > 0) ? local.gallery : (c.gallery || []),
                    highlights: local?.highlights || c.highlights || [],
                    curriculum: local?.curriculum || c.curriculum || [],
                    featured: c.featured,
                    totalLessons: c.total_lessons,
                    totalDuration: c.total_duration,
                    accessDuration: c.access_duration,
                    onlineUrl: c.online_url,
                    videoUrl: local?.videoUrl || c.video_url
                };
            });
            return NextResponse.json({ courses: mappedCourses }, { headers: noCacheHeaders });
        }
    } catch (e) {
        console.warn("Supabase GET courses error:", e);
    }

    // 3. Fallback to local file store
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

        // 1. Save to local CMS DB
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

        // 2. Save full courses list to Supabase site_settings (JSON store)
        try {
            await supabase.from('site_settings').upsert({
                id: 'courses_data',
                data: updatedCourses,
                updated_at: new Date().toISOString()
            });
        } catch (err) {
            console.warn("Could not sync courses_data to Supabase site_settings:", err);
        }

        // 3. Also sync individual record to Supabase courses table
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
            highlights: finalCourse.highlights || [],
            curriculum: finalCourse.curriculum || [],
            featured: Boolean(finalCourse.featured),
            total_lessons: finalCourse.totalLessons ? Number(finalCourse.totalLessons) : null,
            total_duration: finalCourse.totalDuration || null,
            access_duration: finalCourse.accessDuration || null,
            online_url: finalCourse.onlineUrl || null
        };

        try {
            await supabase.from('courses').upsert(payload);
        } catch (sbErr) {
            console.warn("Supabase individual course upsert warning:", sbErr);
        }

        // 4. Purge memory and Next.js page cache
        clearCMSCache('courses');
        try {
            revalidatePath('/');
            revalidatePath('/khoa-hoc');
            revalidatePath(`/khoa-hoc/${finalCourse.slug}`);
            revalidatePath('/admin/khoa-hoc');
        } catch {}

        return NextResponse.json({ 
            success: true, 
            course: finalCourse
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

        // 1. Delete from local DB
        const db = getLocalDB();
        const updatedCourses = db.courses.filter(c => c.id !== id);
        saveLocalDB({ courses: updatedCourses });

        // 2. Delete from Supabase courses table
        try {
            await supabase.from('courses').delete().eq('id', id);
        } catch (sbError) {
            console.warn("Supabase course delete warning:", sbError);
        }

        // 3. Sync updated list to Supabase site_settings
        try {
            await supabase.from('site_settings').upsert({
                id: 'courses_data',
                data: updatedCourses,
                updated_at: new Date().toISOString()
            });
        } catch {}

        clearCMSCache('courses');
        try {
            revalidatePath('/');
            revalidatePath('/khoa-hoc');
            revalidatePath('/admin/khoa-hoc');
        } catch {}

        return NextResponse.json({ success: true, courses: updatedCourses });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
