import { createClient } from '@supabase/supabase-js';
import { courses, instructors, blogPosts, testimonials, siteConfig } from '../src/data/mock';


const supabaseUrl = 'https://kgppkbdmrulgtsjaalof.supabase.co';
const supabaseKey = 'sb_publishable_pdJC1USIYUZ0gUmZpGCrEQ_FH6Lhbuz';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("🚀 Checking Supabase REST Connection...");

    // Test query
    const { data: existingCourses, error: courseErr } = await supabase.from('courses').select('id');
    
    if (courseErr) {
        console.log("⚠️ Query courses notice:", courseErr.message);
    } else {
        console.log(`✅ Found ${existingCourses?.length || 0} existing courses in Supabase.`);
    }

    console.log("🌱 Upserting Courses via Supabase API...");
    for (const c of courses) {
        const { error } = await supabase.from('courses').upsert({
            id: c.id,
            slug: c.slug,
            name: c.name,
            category: c.category,
            course_type: c.courseType,
            description: c.description,
            short_description: c.shortDescription,
            price: c.price,
            contact_for_price: c.contactForPrice || false,
            duration: c.duration,
            max_students: c.maxStudents || null,
            instructor: c.instructor,
            instructor_id: c.instructorId,
            image: c.image,
            highlights: c.highlights || [],
            curriculum: c.curriculum || [],
            featured: c.featured || false,
            total_lessons: c.totalLessons || null,
            total_duration: c.totalDuration || null,
            access_duration: c.accessDuration || null,
            online_url: c.onlineUrl || null
        });
        if (error) console.error(`Error inserting course ${c.id}:`, error.message);
    }

    console.log("🌱 Upserting Instructors...");
    for (const inst of instructors) {
        const { error } = await supabase.from('instructors').upsert({
            id: inst.id,
            name: inst.name,
            role: inst.role,
            title: inst.title,
            image: inst.image,
            bio: inst.bio,
            full_bio: inst.fullBio || null,
            achievements: inst.achievements || [],
            courses: inst.courses || [],
            quote: inst.quote || null,
            experience: inst.experience || null
        });
        if (error) console.error(`Error inserting instructor ${inst.id}:`, error.message);
    }

    console.log("🌱 Upserting Blog Posts...");
    for (const b of blogPosts) {
        const { error } = await supabase.from('blog_posts').upsert({
            id: b.id,
            slug: b.slug,
            title: b.title,
            excerpt: b.excerpt,
            content: b.content,
            image: b.image,
            author: b.author,
            author_image: b.authorImage,
            date: b.date,
            category: b.category,
            read_time: b.readTime,
            featured: b.featured || false
        });
        if (error) console.error(`Error inserting blog ${b.id}:`, error.message);
    }

    console.log("🌱 Upserting Testimonials...");
    for (const t of testimonials) {
        const { error } = await supabase.from('testimonials').upsert({
            id: t.id,
            name: t.name,
            role: t.role,
            avatar: t.avatar,
            content: t.content,
            rating: t.rating,
            course: t.course
        });
        if (error) console.error(`Error inserting testimonial ${t.id}:`, error.message);
    }

    console.log("🌱 Upserting Site Settings...");
    const { error: settingsErr } = await supabase.from('site_settings').upsert({
        id: 'default',
        data: siteConfig
    });
    if (settingsErr) console.error("Error inserting site settings:", settingsErr.message);

    console.log("🎉 Seed attempt finished!");
}

main();
