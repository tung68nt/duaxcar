-- ============================================
-- DuaxCar Kitchen — RLS Security Migration
-- ============================================
-- MỤC ĐÍCH: Thay thế toàn bộ "FOR ALL USING (true)" policies
-- bằng chính sách phân quyền chặt chẽ:
--   - PUBLIC: Chỉ SELECT (đọc)
--   - AUTHENTICATED admin: Full CRUD
--
-- HƯỚNG DẪN: Chạy script này trong Supabase SQL Editor
-- ============================================

-- =====================
-- 1. TABLE: courses
-- =====================
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Courses Access" ON public.courses;

-- Public: Read-only
CREATE POLICY "courses_select_public"
    ON public.courses FOR SELECT
    USING (true);

-- Authenticated users: Full CRUD
CREATE POLICY "courses_insert_authenticated"
    ON public.courses FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "courses_update_authenticated"
    ON public.courses FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "courses_delete_authenticated"
    ON public.courses FOR DELETE
    TO authenticated
    USING (true);


-- =====================
-- 2. TABLE: instructors
-- =====================
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Instructors Access" ON public.instructors;

CREATE POLICY "instructors_select_public"
    ON public.instructors FOR SELECT
    USING (true);

CREATE POLICY "instructors_insert_authenticated"
    ON public.instructors FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "instructors_update_authenticated"
    ON public.instructors FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "instructors_delete_authenticated"
    ON public.instructors FOR DELETE
    TO authenticated
    USING (true);


-- =====================
-- 3. TABLE: blog_posts
-- =====================
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Blog Access" ON public.blog_posts;

CREATE POLICY "blog_posts_select_public"
    ON public.blog_posts FOR SELECT
    USING (true);

CREATE POLICY "blog_posts_insert_authenticated"
    ON public.blog_posts FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "blog_posts_update_authenticated"
    ON public.blog_posts FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "blog_posts_delete_authenticated"
    ON public.blog_posts FOR DELETE
    TO authenticated
    USING (true);


-- =====================
-- 4. TABLE: testimonials
-- =====================
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Testimonials Access" ON public.testimonials;

CREATE POLICY "testimonials_select_public"
    ON public.testimonials FOR SELECT
    USING (true);

CREATE POLICY "testimonials_insert_authenticated"
    ON public.testimonials FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "testimonials_update_authenticated"
    ON public.testimonials FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "testimonials_delete_authenticated"
    ON public.testimonials FOR DELETE
    TO authenticated
    USING (true);


-- =====================
-- 5. TABLE: registrations
-- =====================
-- Đặc biệt: Cho phép anon INSERT (form đăng ký public)
-- nhưng chỉ authenticated mới được đọc/sửa/xóa
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Registrations Access" ON public.registrations;

-- Anon users CAN insert (public registration form)
CREATE POLICY "registrations_insert_anon"
    ON public.registrations FOR INSERT
    TO anon
    WITH CHECK (true);

-- Authenticated users: Full access
CREATE POLICY "registrations_select_authenticated"
    ON public.registrations FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "registrations_insert_authenticated"
    ON public.registrations FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "registrations_update_authenticated"
    ON public.registrations FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "registrations_delete_authenticated"
    ON public.registrations FOR DELETE
    TO authenticated
    USING (true);


-- =====================
-- 6. TABLE: site_settings
-- =====================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Settings Access" ON public.site_settings;

-- Public: Read-only (for frontend rendering)
CREATE POLICY "site_settings_select_public"
    ON public.site_settings FOR SELECT
    USING (true);

-- Authenticated: Full CRUD
CREATE POLICY "site_settings_insert_authenticated"
    ON public.site_settings FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "site_settings_update_authenticated"
    ON public.site_settings FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "site_settings_delete_authenticated"
    ON public.site_settings FOR DELETE
    TO authenticated
    USING (true);


-- =====================
-- 7. TABLE: media_library (if exists)
-- =====================
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'media_library'
    ) THEN
        ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

        -- Drop existing overly permissive policies
        EXECUTE 'DROP POLICY IF EXISTS "Public Media Access" ON public.media_library';

        -- Read: Public (for displaying images on site)
        EXECUTE 'CREATE POLICY "media_select_public" ON public.media_library FOR SELECT USING (true)';

        -- Write: Authenticated only
        EXECUTE 'CREATE POLICY "media_insert_authenticated" ON public.media_library FOR INSERT TO authenticated WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "media_update_authenticated" ON public.media_library FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "media_delete_authenticated" ON public.media_library FOR DELETE TO authenticated USING (true)';
    END IF;
END $$;


-- ============================================
-- VERIFICATION: Liệt kê tất cả policies hiện hành
-- ============================================
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
