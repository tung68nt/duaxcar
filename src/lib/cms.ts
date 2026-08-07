import { supabase } from "@/lib/supabase";
import { Course, Instructor, BlogPost, Testimonial } from "@/lib/types";

// Dynamic Data Fetchers with Supabase Fallback

export async function getSupabaseCourses(): Promise<Course[]> {
    try {
        const { data, error } = await supabase.from('courses').select('*');
        if (error || !data || data.length === 0) return [];
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
    } catch {
        return [];
    }
}

export async function getSupabaseInstructors(): Promise<Instructor[]> {
    try {
        const { data, error } = await supabase.from('instructors').select('*');
        if (error || !data || data.length === 0) return [];
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
    } catch {
        return [];
    }
}

export async function getSupabaseBlogPosts(): Promise<BlogPost[]> {
    try {
        const { data, error } = await supabase.from('blog_posts').select('*');
        if (error || !data || data.length === 0) return [];
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
    } catch {
        return [];
    }
}

export async function getSupabaseTestimonials(): Promise<Testimonial[]> {
    try {
        const { data, error } = await supabase.from('testimonials').select('*');
        if (error || !data || data.length === 0) return [];
        return data.map((t) => ({
            id: t.id,
            name: t.name,
            role: t.role,
            avatar: t.avatar,
            content: t.content,
            rating: Number(t.rating),
            course: t.course
        }));
    } catch {
        return [];
    }
}
