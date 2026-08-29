import { cache } from "react";
import { supabase } from "@/lib/supabase";
import { Course, Instructor, BlogPost, Testimonial } from "@/lib/types";
import { getLocalDB, SiteSettings, FAQItem } from "@/lib/db";
import { defaultPolicies, PolicyData } from "@/data/default-policies";

export type { PolicyData };

// In-memory caching layer with TTL to prevent slow repetitive network hops to Supabase
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

type CacheEntry<T> = {
    data: T;
    timestamp: number;
};

const memoryCache = new Map<string, CacheEntry<any>>();

export function clearCMSCache(key?: string) {
    if (key) {
        memoryCache.delete(key);
    } else {
        memoryCache.clear();
    }
}

async function fetchWithTimeout<T>(promise: PromiseLike<T>, timeoutMs = 1500): Promise<T> {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Supabase query timeout after ${timeoutMs}ms`)), timeoutMs);
    });
    try {
        return await Promise.race([Promise.resolve(promise), timeoutPromise]);
    } finally {
        clearTimeout(timer!);
    }
}

export const getSupabaseCourses = cache(async (): Promise<Course[]> => {
    const cached = memoryCache.get('courses');
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
        return cached.data;
    }

    // 1. Try reading complete course list from Supabase site_settings
    try {
        const queryPromise = supabase.from('site_settings').select('data').eq('id', 'courses_data').single();
        const { data: settingData, error: settingError } = (await fetchWithTimeout(queryPromise, 1500)) as any;
        if (!settingError && settingData && Array.isArray(settingData.data) && settingData.data.length > 0) {
            let localCourses: Course[] = [];
            try {
                const db = getLocalDB();
                localCourses = db.courses || [];
            } catch {}

            const mergedCourses: Course[] = settingData.data.map((c: any) => {
                const local = localCourses.find(x => x.id === c.id || x.slug === c.slug);
                return {
                    ...c,
                    image: local?.image || c.image,
                    gallery: (local?.gallery && local.gallery.length > 0) ? local.gallery : (c.gallery || []),
                    videoUrl: local?.videoUrl || c.videoUrl || c.video_url
                };
            });

            memoryCache.set('courses', { data: mergedCourses, timestamp: Date.now() });
            return mergedCourses;
        }
    } catch (e) {
        console.warn("Supabase fetch courses_data timed out/failed:", e);
    }

    // 2. Fallback to Supabase courses table
    try {
        const queryPromise = supabase.from('courses').select('*').order('created_at', { ascending: false });
        const { data, error } = (await fetchWithTimeout(queryPromise, 1500)) as any;
        if (!error && data && data.length > 0) {
            let localCourses: Course[] = [];
            try {
                const db = getLocalDB();
                localCourses = db.courses || [];
            } catch {}

            const mappedCourses: Course[] = data.map((c: any) => {
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
                    highlights: (local?.highlights && local.highlights.length > 0) ? local.highlights : (c.highlights || []),
                    curriculum: (local?.curriculum && local.curriculum.length > 0) ? local.curriculum : (c.curriculum || []),
                    featured: c.featured,
                    totalLessons: c.total_lessons,
                    totalDuration: c.total_duration,
                    accessDuration: c.access_duration,
                    onlineUrl: c.online_url,
                    videoUrl: local?.videoUrl || c.video_url
                };
            });

            memoryCache.set('courses', { data: mappedCourses, timestamp: Date.now() });
            return mappedCourses;
        }
    } catch (e) {
        console.warn("Supabase fetch courses failed/timed out, using local DB:", e);
    }

    try {
        const db = getLocalDB();
        if (db.courses && db.courses.length > 0) {
            memoryCache.set('courses', { data: db.courses, timestamp: Date.now() });
            return db.courses;
        }
    } catch {}

    return [];
});

export const getSupabaseInstructors = cache(async (): Promise<Instructor[]> => {
    const cached = memoryCache.get('instructors');
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
        return cached.data;
    }

    try {
        const queryPromise = supabase.from('instructors').select('*');
        const { data, error } = (await fetchWithTimeout(queryPromise, 1500)) as any;
        if (!error && data && data.length > 0) {
            const mapped = data.map((i: any) => ({
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
            memoryCache.set('instructors', { data: mapped, timestamp: Date.now() });
            return mapped;
        }
    } catch (e) {
        console.warn("Supabase fetch instructors failed/timed out, fallback to local DB:", e);
    }

    try {
        const db = getLocalDB();
        if (db.instructors && db.instructors.length > 0) {
            memoryCache.set('instructors', { data: db.instructors, timestamp: Date.now() });
            return db.instructors;
        }
    } catch {}

    return [];
});

export const getSupabaseBlogPosts = cache(async (): Promise<BlogPost[]> => {
    const cached = memoryCache.get('blogs');
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
        return cached.data;
    }

    try {
        const queryPromise = supabase.from('blog_posts').select('*').order('date', { ascending: false });
        const { data, error } = (await fetchWithTimeout(queryPromise, 1500)) as any;
        if (!error && data && data.length > 0) {
            const mapped = data.map((b: any) => ({
                id: b.id,
                slug: b.slug,
                title: b.title,
                excerpt: b.excerpt,
                content: b.content,
                image: b.image,
                author: b.author,
                authorImage: b.author_image,
                date: b.date,
                category: b.category,
                readTime: b.read_time,
                featured: b.featured
            }));
            memoryCache.set('blogs', { data: mapped, timestamp: Date.now() });
            return mapped;
        }
    } catch (e) {
        console.warn("Supabase fetch blog posts failed/timed out, fallback to local DB:", e);
    }

    try {
        const db = getLocalDB();
        if (db.blogs && db.blogs.length > 0) {
            memoryCache.set('blogs', { data: db.blogs, timestamp: Date.now() });
            return db.blogs;
        }
    } catch {}

    return [];
});

export const getSupabaseTestimonials = cache(async (): Promise<Testimonial[]> => {
    const cached = memoryCache.get('testimonials');
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
        return cached.data;
    }

    try {
        const queryPromise = supabase.from('testimonials').select('*');
        const { data, error } = (await fetchWithTimeout(queryPromise, 1500)) as any;
        if (!error && data && data.length > 0) {
            const mapped = data.map((t: any) => ({
                id: t.id,
                name: t.name,
                role: t.role,
                avatar: t.avatar,
                content: t.content,
                rating: Number(t.rating),
                course: t.course
            }));
            memoryCache.set('testimonials', { data: mapped, timestamp: Date.now() });
            return mapped;
        }
    } catch (e) {
        console.warn("Supabase fetch testimonials failed/timed out, fallback to local DB:", e);
    }

    try {
        const db = getLocalDB();
        if (db.testimonials && db.testimonials.length > 0) {
            memoryCache.set('testimonials', { data: db.testimonials, timestamp: Date.now() });
            return db.testimonials;
        }
    } catch {}

    return [];
});

export const getSupabaseFaqs = cache(async (): Promise<FAQItem[]> => {
    const cached = memoryCache.get('faqs');
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
        return cached.data;
    }

    try {
        const queryPromise = supabase.from('site_settings').select('data').eq('id', 'default_faqs').single();
        const { data, error } = (await fetchWithTimeout(queryPromise, 1500)) as any;
        if (!error && data && Array.isArray(data.data) && data.data.length > 0) {
            memoryCache.set('faqs', { data: data.data, timestamp: Date.now() });
            return data.data;
        }
    } catch {}

    try {
        const db = getLocalDB();
        memoryCache.set('faqs', { data: db.faqs, timestamp: Date.now() });
        return db.faqs;
    } catch {
        return [];
    }
});

export const getSupabaseSettings = cache(async (): Promise<SiteSettings | null> => {
    const cached = memoryCache.get('settings');
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
        return cached.data;
    }

    try {
        const queryPromise = supabase.from('site_settings').select('*').eq('id', 'default').single();
        const { data, error } = (await fetchWithTimeout(queryPromise, 1500)) as any;
        if (!error && data && data.data) {
            memoryCache.set('settings', { data: data.data, timestamp: Date.now() });
            return data.data;
        }
    } catch (e) {
        console.warn("Supabase fetch site_settings failed/timed out, fallback to local DB:", e);
    }

    try {
        const db = getLocalDB();
        memoryCache.set('settings', { data: db.settings, timestamp: Date.now() });
        return db.settings;
    } catch {
        return null;
    }
});

export const getSupabasePolicy = cache(async (id: "bao-mat" | "dieu-khoan" | "thanh-toan"): Promise<PolicyData> => {
    const fallback = defaultPolicies.find((p) => p.id === id) || defaultPolicies[0];

    const cached = memoryCache.get(`policy_${id}`);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
        return cached.data;
    }

    try {
        const queryPromise = supabase
            .from('site_settings')
            .select('data')
            .eq('id', `policy_${id}`)
            .single();
        const { data, error } = (await fetchWithTimeout(queryPromise, 1500)) as any;

        if (!error && data && data.data && data.data.content) {
            memoryCache.set(`policy_${id}`, { data: data.data, timestamp: Date.now() });
            return data.data;
        }
    } catch {}

    try {
        const db = getLocalDB();
        const found = db.policies?.find((p) => p.id === id);
        if (found && found.content) {
            memoryCache.set(`policy_${id}`, { data: found, timestamp: Date.now() });
            return found;
        }
    } catch {}

    return fallback;
});
