import { supabase } from "@/lib/supabase";
import { Course, Instructor, BlogPost, Testimonial } from "@/lib/types";
import { getLocalDB, SiteSettings, FAQItem } from "@/lib/db";

// Dynamic Data Fetchers with Server Database + Supabase Fallback

export async function getSupabaseCourses(): Promise<Course[]> {
    try {
        const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
            return data.map((c) => ({
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
        }
    } catch (e) {
        console.warn("Supabase fetch courses failed, fallback to local DB:", e);
    }

    try {
        const db = getLocalDB();
        if (db.courses && db.courses.length > 0) {
            return db.courses;
        }
    } catch {}

    return [];
}

export async function getSupabaseInstructors(): Promise<Instructor[]> {
    try {
        const { data, error } = await supabase.from('instructors').select('*');
        if (!error && data && data.length > 0) {
            return data.map((i) => ({
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
        }
    } catch (e) {
        console.warn("Supabase fetch instructors failed, fallback to local DB:", e);
    }

    try {
        const db = getLocalDB();
        if (db.instructors && db.instructors.length > 0) {
            return db.instructors;
        }
    } catch {}

    return [];
}

export async function getSupabaseBlogPosts(): Promise<BlogPost[]> {
    try {
        const { data, error } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
        if (!error && data && data.length > 0) {
            return data.map((b) => ({
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
        }
    } catch (e) {
        console.warn("Supabase fetch blog posts failed, fallback to local DB:", e);
    }

    try {
        const db = getLocalDB();
        if (db.blogs && db.blogs.length > 0) {
            return db.blogs;
        }
    } catch {}

    return [];
}

export async function getSupabaseTestimonials(): Promise<Testimonial[]> {
    try {
        const { data, error } = await supabase.from('testimonials').select('*');
        if (!error && data && data.length > 0) {
            return data.map((t) => ({
                id: t.id,
                name: t.name,
                role: t.role,
                avatar: t.avatar,
                content: t.content,
                rating: Number(t.rating),
                course: t.course
            }));
        }
    } catch (e) {
        console.warn("Supabase fetch testimonials failed, fallback to local DB:", e);
    }

    try {
        const db = getLocalDB();
        if (db.testimonials && db.testimonials.length > 0) {
            return db.testimonials;
        }
    } catch {}

    return [];
}

export async function getSupabaseFaqs(): Promise<FAQItem[]> {
    try {
        const { data, error } = await supabase.from('site_settings').select('data').eq('id', 'default_faqs').single();
        if (!error && data && Array.isArray(data.data) && data.data.length > 0) {
            return data.data;
        }
    } catch {}

    try {
        const db = getLocalDB();
        return db.faqs;
    } catch {
        return [];
    }
}

export async function getSupabaseSettings(): Promise<SiteSettings | null> {
    try {
        const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'default').single();
        if (!error && data && data.data) {
            return data.data;
        }
    } catch (e) {
        console.warn("Supabase fetch site_settings failed, fallback to local DB:", e);
    }

    try {
        const db = getLocalDB();
        return db.settings;
    } catch {
        return null;
    }
}
