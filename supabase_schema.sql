-- SQL Migration Script for Supabase SQL Editor

-- 1. Table: courses
CREATE TABLE IF NOT EXISTS public.courses (
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

-- 2. Table: instructors
CREATE TABLE IF NOT EXISTS public.instructors (
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

-- 3. Table: blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
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

-- 4. Table: testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar TEXT NOT NULL,
    content TEXT NOT NULL,
    rating NUMERIC NOT NULL,
    course TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table: registrations
CREATE TABLE IF NOT EXISTS public.registrations (
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

-- 6. Table: site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Table: visitor_profiles (Lưu hồ sơ và dấu vết khách hàng tiềm năng)
CREATE TABLE IF NOT EXISTS public.visitor_profiles (
    id TEXT PRIMARY KEY,
    visitor_id TEXT UNIQUE NOT NULL,
    ip TEXT,
    city TEXT,
    country TEXT DEFAULT 'Việt Nam',
    device TEXT DEFAULT 'desktop',
    browser TEXT,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_visits INTEGER DEFAULT 1,
    session_count INTEGER DEFAULT 1,
    first_referrer TEXT,
    first_utm_source TEXT,
    first_utm_campaign TEXT,
    is_converted BOOLEAN DEFAULT FALSE,
    converted_lead_id TEXT,
    converted_at TIMESTAMP WITH TIME ZONE
);

-- 8. Table: analytics_pageviews (Lưu chi tiết từng lượt xem trang, khóa học, bài viết)
CREATE TABLE IF NOT EXISTS public.analytics_pageviews (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    ip TEXT,
    city TEXT,
    country TEXT DEFAULT 'Việt Nam',
    path TEXT NOT NULL,
    title TEXT NOT NULL,
    page_type TEXT DEFAULT 'other',
    target_slug TEXT,
    target_name TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    device TEXT DEFAULT 'desktop',
    browser TEXT,
    duration_seconds INTEGER DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thêm các cột lưu vết vào bảng registrations nếu chưa có
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS visitor_id TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS ip TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS city TEXT;

-- Enable RLS & Allow Public Access
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Courses Access" ON public.courses;
CREATE POLICY "Public Courses Access" ON public.courses FOR ALL USING (true);

ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Instructors Access" ON public.instructors;
CREATE POLICY "Public Instructors Access" ON public.instructors FOR ALL USING (true);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Blog Access" ON public.blog_posts;
CREATE POLICY "Public Blog Access" ON public.blog_posts FOR ALL USING (true);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Testimonials Access" ON public.testimonials;
CREATE POLICY "Public Testimonials Access" ON public.testimonials FOR ALL USING (true);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Registrations Access" ON public.registrations;
CREATE POLICY "Public Registrations Access" ON public.registrations FOR ALL USING (true);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Settings Access" ON public.site_settings;
CREATE POLICY "Public Settings Access" ON public.site_settings FOR ALL USING (true);

ALTER TABLE public.visitor_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Visitor Profiles Access" ON public.visitor_profiles;
CREATE POLICY "Public Visitor Profiles Access" ON public.visitor_profiles FOR ALL USING (true);

ALTER TABLE public.analytics_pageviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Analytics Access" ON public.analytics_pageviews;
CREATE POLICY "Public Analytics Access" ON public.analytics_pageviews FOR ALL USING (true);
