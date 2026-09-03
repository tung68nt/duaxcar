/**
 * Supabase Browser Client
 * 
 * Dùng trong Client Components ("use client").
 * Sử dụng Anon Key — an toàn cho browser bundle.
 * Không bao giờ import service_role key ở đây.
 */
import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
    if (client) return client;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variables.'
        );
    }

    client = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return client;
}
