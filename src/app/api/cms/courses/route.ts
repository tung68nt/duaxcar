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
            let localCourses: Course[] = [];
            try {
                const db = getLocalDB();
                localCourses = db.courses || [];
            } catch {}

            // Supabase is authoritative in production. Fallback to local only for missing fields.
            const mergedCourses: Course[] = settingData.data.map((c: Course) => {
                const local = localCourses.find(x => x.id === c.id || (x.slug && x.slug === c.slug));
                return {
                    ...local,
                    ...c,
                    image: c.image || local?.image || '/images/courses/pho-bo.jpg',
                    gallery: (c.gallery && Array.isArray(c.gallery)) ? c.gallery : (local?.gallery || []),
                    videoUrl: c.videoUrl !== undefined ? c.videoUrl : (local?.videoUrl || '')
                };
            });

            // Append any courses that exist locally but not yet in Supabase
            for (const loc of localCourses) {
                if (!mergedCourses.some(c => c.id === loc.id || (c.slug && c.slug === loc.slug))) {
                    mergedCourses.unshift(loc);
                }
            }

            return NextResponse.json({ courses: mergedCourses }, { headers: noCacheHeaders });
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
                const local = localCourses.find(x => x.id === c.id || (x.slug && x.slug === c.slug));
                return {
                    id: c.id,
                    slug: c.slug || local?.slug,
                    name: c.name || local?.name,
                    category: c.category || local?.category,
                    courseType: c.course_type || local?.courseType,
                    description: c.description !== undefined ? c.description : local?.description,
                    shortDescription: c.short_description || local?.shortDescription,
                    price: c.price !== undefined ? Number(c.price) : Number(local?.price || 0),
                    contactForPrice: c.contact_for_price !== undefined ? Boolean(c.contact_for_price) : Boolean(local?.contactForPrice),
                    duration: c.duration || local?.duration,
                    maxStudents: c.max_students !== undefined ? local?.maxStudents : c.max_students,
                    instructor: c.instructor || local?.instructor,
                    instructorId: c.instructor_id || local?.instructorId,
                    image: c.image || local?.image || '/images/courses/pho-bo.jpg',
                    gallery: (local?.gallery && local.gallery.length > 0) ? local.gallery : (c.gallery || []),
                    highlights: c.highlights || local?.highlights || [],
                    curriculum: c.curriculum || local?.curriculum || [],
                    featured: c.featured !== undefined ? c.featured : local?.featured,
                    totalLessons: c.total_lessons || local?.totalLessons,
                    totalDuration: c.total_duration || local?.totalDuration,
                    accessDuration: c.access_duration || local?.accessDuration,
                    onlineUrl: c.online_url || local?.onlineUrl,
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

        // 1. Fetch CURRENT authoritative courses list from Supabase site_settings first
        let currentCourses: Course[] = [];
        try {
            const { data: settingData, error: settingError } = await supabase
                .from('site_settings')
                .select('data')
                .eq('id', 'courses_data')
                .single();
            if (!settingError && settingData && Array.isArray(settingData.data) && settingData.data.length > 0) {
                currentCourses = settingData.data;
            }
        } catch (e) {
            console.warn("Could not read site_settings.courses_data before update:", e);
        }

        // Fallback to local DB if Supabase courses_data is empty
        if (currentCourses.length === 0) {
            try {
                const db = getLocalDB();
                currentCourses = db.courses || [];
            } catch {}
        }

        // 2. Update existing course or append
        const existingIndex = currentCourses.findIndex(c => 
            c.id === courseId || (c.slug && c.slug === finalCourse.slug)
        );

        let updatedCourses: Course[] = [];
        if (existingIndex >= 0) {
            updatedCourses = [...currentCourses];
            finalCourse.id = currentCourses[existingIndex].id; // Retain canonical ID
            updatedCourses[existingIndex] = finalCourse;
        } else {
            updatedCourses = [finalCourse, ...currentCourses];
        }

        // 3. Save to Supabase site_settings (Primary Source of Truth in production)
        try {
            const { error: sbSettingsErr } = await supabase.from('site_settings').upsert({
                id: 'courses_data',
                data: updatedCourses,
                updated_at: new Date().toISOString()
            });
            if (sbSettingsErr) {
                console.error("Supabase site_settings upsert error:", sbSettingsErr);
                return NextResponse.json({ 
                    error: `Lỗi đồng bộ Supabase: ${sbSettingsErr.message || 'Không thể ghi dữ liệu'}` 
                }, { status: 500 });
            }
        } catch (err: any) {
            console.error("Could not sync courses_data to Supabase site_settings:", err);
            return NextResponse.json({ 
                error: `Lỗi kết nối Supabase: ${err?.message || 'Không xác định'}` 
            }, { status: 500 });
        }

        // 4. Save to local CMS DB as backup (ignore read-only errors on serverless Vercel)
        try {
            saveLocalDB({ courses: updatedCourses });
        } catch (e) {
            console.warn("Local DB save ignored (read-only filesystem on Vercel):", e);
        }

        // 5. Also sync individual record to Supabase relational courses table
        const payload: any = {
            id: finalCourse.id,
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
            const { error: sbCourseErr } = await supabase.from('courses').upsert(payload);
            if (sbCourseErr) {
                console.warn("Supabase individual course upsert warning:", sbCourseErr);
            }
        } catch (sbErr) {
            console.warn("Supabase individual course upsert warning:", sbErr);
        }

        // 6. Purge memory and Next.js page cache
        clearCMSCache('courses');
        try {
            revalidatePath('/', 'page');
            revalidatePath('/khoa-hoc', 'page');
            revalidatePath(`/khoa-hoc/${finalCourse.slug}`, 'page');
            revalidatePath('/admin/khoa-hoc', 'page');
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

        // 1. Fetch CURRENT courses from Supabase
        let currentCourses: Course[] = [];
        try {
            const { data } = await supabase.from('site_settings').select('data').eq('id', 'courses_data').single();
            if (data && Array.isArray(data.data)) {
                currentCourses = data.data;
            }
        } catch {}

        if (currentCourses.length === 0) {
            try {
                const db = getLocalDB();
                currentCourses = db.courses || [];
            } catch {}
        }

        const filtered = currentCourses.filter(c => c.id !== id);

        // 2. Delete from Supabase site_settings
        await supabase.from('site_settings').upsert({
            id: 'courses_data',
            data: filtered,
            updated_at: new Date().toISOString()
        });

        // 3. Delete from Supabase courses table
        try {
            await supabase.from('courses').delete().eq('id', id);
        } catch (e) {
            console.warn("Could not delete from Supabase courses table:", e);
        }

        // 4. Save to local DB as backup
        try {
            saveLocalDB({ courses: filtered });
        } catch {}

        clearCMSCache('courses');
        try {
            revalidatePath('/', 'page');
            revalidatePath('/khoa-hoc', 'page');
            revalidatePath('/admin/khoa-hoc', 'page');
        } catch {}

        return NextResponse.json({ success: true, courses: filtered });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
