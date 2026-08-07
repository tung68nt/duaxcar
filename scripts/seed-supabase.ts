import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import postgres from 'postgres';
import { courses, instructors, blogPosts, testimonials, siteConfig } from '../src/data/mock';

// Connection string specifying options search path / target
const connectionString = 'postgresql://postgres.kgppkbdmrulgtsjaalof:Duaxcar2025%40%60@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require';
const sql = postgres(connectionString, { prepare: false, ssl: { rejectUnauthorized: false } });

async function main() {
    console.log("🚀 Connecting to Supabase Postgres via Pooler 6543 with SSL options...");

    // 1. Create tables
    console.log("📌 Creating tables if not exist...");

    await sql`
        CREATE TABLE IF NOT EXISTS courses (
            id TEXT PRIMARY KEY,
            slug TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            course_type TEXT NOT NULL,
            description TEXT NOT NULL,
            short_description TEXT NOT NULL,
            price NUMERIC NOT NULL,
            contact_for_price BOOLEAN DEFAULT FALSE,
            duration TEXT NOT NULL,
            max_students INTEGER,
            instructor TEXT NOT NULL,
            instructor_id TEXT NOT NULL,
            image TEXT NOT NULL,
            highlights JSONB DEFAULT '[]'::jsonb,
            curriculum JSONB DEFAULT '[]'::jsonb,
            featured BOOLEAN DEFAULT FALSE,
            total_lessons INTEGER,
            total_duration TEXT,
            access_duration TEXT,
            online_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS instructors (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            title TEXT NOT NULL,
            image TEXT NOT NULL,
            bio TEXT NOT NULL,
            full_bio TEXT,
            achievements JSONB DEFAULT '[]'::jsonb,
            courses JSONB DEFAULT '[]'::jsonb,
            quote TEXT,
            experience TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS blog_posts (
            id TEXT PRIMARY KEY,
            slug TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            excerpt TEXT NOT NULL,
            content TEXT NOT NULL,
            image TEXT NOT NULL,
            author TEXT NOT NULL,
            author_image TEXT NOT NULL,
            date TEXT NOT NULL,
            category TEXT NOT NULL,
            read_time TEXT NOT NULL,
            featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS testimonials (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            avatar TEXT NOT NULL,
            content TEXT NOT NULL,
            rating NUMERIC NOT NULL,
            course TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS registrations (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            course_name TEXT NOT NULL,
            note TEXT,
            status TEXT DEFAULT 'pending',
            date TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS site_settings (
            id TEXT PRIMARY KEY DEFAULT 'default',
            data JSONB NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `;

    console.log("✅ Tables created successfully!");

    // Enable RLS / Policies or Public Select
    await sql`ALTER TABLE courses ENABLE ROW LEVEL SECURITY;`;
    await sql`DROP POLICY IF EXISTS "Public Read Courses" ON courses;`;
    await sql`CREATE POLICY "Public Read Courses" ON courses FOR SELECT USING (true);`;
    await sql`DROP POLICY IF EXISTS "Public All Courses" ON courses;`;
    await sql`CREATE POLICY "Public All Courses" ON courses FOR ALL USING (true);`;

    await sql`ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;`;
    await sql`DROP POLICY IF EXISTS "Public Read Instructors" ON instructors;`;
    await sql`CREATE POLICY "Public Read Instructors" ON instructors FOR SELECT USING (true);`;
    await sql`DROP POLICY IF EXISTS "Public All Instructors" ON instructors;`;
    await sql`CREATE POLICY "Public All Instructors" ON instructors FOR ALL USING (true);`;

    await sql`ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;`;
    await sql`DROP POLICY IF EXISTS "Public Read Blog" ON blog_posts;`;
    await sql`CREATE POLICY "Public Read Blog" ON blog_posts FOR SELECT USING (true);`;
    await sql`DROP POLICY IF EXISTS "Public All Blog" ON blog_posts;`;
    await sql`CREATE POLICY "Public All Blog" ON blog_posts FOR ALL USING (true);`;

    await sql`ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;`;
    await sql`DROP POLICY IF EXISTS "Public Read Testimonials" ON testimonials;`;
    await sql`CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);`;
    await sql`DROP POLICY IF EXISTS "Public All Testimonials" ON testimonials;`;
    await sql`CREATE POLICY "Public All Testimonials" ON testimonials FOR ALL USING (true);`;

    await sql`ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;`;
    await sql`DROP POLICY IF EXISTS "Public All Registrations" ON registrations;`;
    await sql`CREATE POLICY "Public All Registrations" ON registrations FOR ALL USING (true);`;

    await sql`ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;`;
    await sql`DROP POLICY IF EXISTS "Public All Settings" ON site_settings;`;
    await sql`CREATE POLICY "Public All Settings" ON site_settings FOR ALL USING (true);`;

    // 2. Seed Data
    console.log("🌱 Seeding Courses...");
    for (const c of courses) {
        await sql`
            INSERT INTO courses (
                id, slug, name, category, course_type, description, short_description,
                price, contact_for_price, duration, max_students, instructor, instructor_id,
                image, highlights, curriculum, featured, total_lessons, total_duration, access_duration, online_url
            ) VALUES (
                ${c.id}, ${c.slug}, ${c.name}, ${c.category}, ${c.courseType}, ${c.description}, ${c.shortDescription},
                ${c.price}, ${c.contactForPrice || false}, ${c.duration}, ${c.maxStudents || null}, ${c.instructor}, ${c.instructorId},
                ${c.image}, ${JSON.stringify(c.highlights || [])}, ${JSON.stringify(c.curriculum || [])}, ${c.featured || false},
                ${c.totalLessons || null}, ${c.totalDuration || null}, ${c.accessDuration || null}, ${c.onlineUrl || null}
            )
            ON CONFLICT (id) DO UPDATE SET
                slug = EXCLUDED.slug,
                name = EXCLUDED.name,
                category = EXCLUDED.category,
                course_type = EXCLUDED.course_type,
                description = EXCLUDED.description,
                short_description = EXCLUDED.short_description,
                price = EXCLUDED.price,
                contact_for_price = EXCLUDED.contact_for_price,
                duration = EXCLUDED.duration,
                max_students = EXCLUDED.max_students,
                instructor = EXCLUDED.instructor,
                instructor_id = EXCLUDED.instructor_id,
                image = EXCLUDED.image,
                highlights = EXCLUDED.highlights,
                curriculum = EXCLUDED.curriculum,
                featured = EXCLUDED.featured,
                total_lessons = EXCLUDED.total_lessons,
                total_duration = EXCLUDED.total_duration,
                access_duration = EXCLUDED.access_duration,
                online_url = EXCLUDED.online_url;
        `;
    }

    console.log("🌱 Seeding Instructors...");
    for (const inst of instructors) {
        await sql`
            INSERT INTO instructors (
                id, name, role, title, image, bio, full_bio, achievements, courses, quote, experience
            ) VALUES (
                ${inst.id}, ${inst.name}, ${inst.role}, ${inst.title}, ${inst.image}, ${inst.bio}, ${inst.fullBio || null},
                ${JSON.stringify(inst.achievements || [])}, ${JSON.stringify(inst.courses || [])}, ${inst.quote || null}, ${inst.experience || null}
            )
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                role = EXCLUDED.role,
                title = EXCLUDED.title,
                image = EXCLUDED.image,
                bio = EXCLUDED.bio,
                full_bio = EXCLUDED.full_bio,
                achievements = EXCLUDED.achievements,
                courses = EXCLUDED.courses,
                quote = EXCLUDED.quote,
                experience = EXCLUDED.experience;
        `;
    }

    console.log("🌱 Seeding Blog Posts...");
    for (const b of blogPosts) {
        await sql`
            INSERT INTO blog_posts (
                id, slug, title, excerpt, content, image, author, author_image, date, category, read_time, featured
            ) VALUES (
                ${b.id}, ${b.slug}, ${b.title}, ${b.excerpt}, ${b.content}, ${b.image}, ${b.author}, ${b.authorImage},
                ${b.date}, ${b.category}, ${b.readTime}, ${b.featured || false}
            )
            ON CONFLICT (id) DO UPDATE SET
                slug = EXCLUDED.slug,
                title = EXCLUDED.title,
                excerpt = EXCLUDED.excerpt,
                content = EXCLUDED.content,
                image = EXCLUDED.image,
                author = EXCLUDED.author,
                author_image = EXCLUDED.author_image,
                date = EXCLUDED.date,
                category = EXCLUDED.category,
                read_time = EXCLUDED.read_time,
                featured = EXCLUDED.featured;
        `;
    }

    console.log("🌱 Seeding Testimonials...");
    for (const t of testimonials) {
        await sql`
            INSERT INTO testimonials (
                id, name, role, avatar, content, rating, course
            ) VALUES (
                ${t.id}, ${t.name}, ${t.role}, ${t.avatar}, ${t.content}, ${t.rating}, ${t.course}
            )
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                role = EXCLUDED.role,
                avatar = EXCLUDED.avatar,
                content = EXCLUDED.content,
                rating = EXCLUDED.rating,
                course = EXCLUDED.course;
        `;
    }

    console.log("🌱 Seeding Site Settings...");
    await sql`
        INSERT INTO site_settings (id, data)
        VALUES ('default', ${JSON.stringify(siteConfig)})
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;
    `;

    console.log("🎉 Seed completed successfully!");
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Migration Error:", err);
    process.exit(1);
});
