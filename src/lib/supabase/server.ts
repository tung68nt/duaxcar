/**
 * Supabase Server Client
 * 
 * Dùng trong Server Components, Route Handlers, Middleware.
 * Tạo mới mỗi request để đúng cookie context.
 * Sử dụng @supabase/ssr với Next.js cookies() API.
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getSupabaseServerClient() {
    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variables.'
        );
    }

    return createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // Cookies can't be set in Server Components (read-only).
                    // This is expected when called from a Server Component.
                    // Middleware and Route Handlers can set cookies.
                }
            },
        },
    });
}

/**
 * Supabase Admin Client (Service Role)
 * 
 * CHỈA DÙNG trong server-side operations cần bypass RLS.
 * TUYỆT ĐỐI KHÔNG import trong client components.
 * TUYỆT ĐỐI KHÔNG expose ra browser bundle.
 */
export function getSupabaseAdminClient() {
    // Dynamic import to tree-shake from client bundle
    const { createClient } = require('@supabase/supabase-js');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            '[Supabase Admin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
            'Service role key must ONLY be set in server environment variables.'
        );
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
