/**
 * @deprecated — Sử dụng import từ '@/lib/supabase/client' hoặc '@/lib/supabase/server' thay thế.
 * 
 * File này giữ lại tạm thời cho backward compatibility trong quá trình migration.
 * KHÔNG hardcode keys. KHÔNG dùng cho code mới.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        '[Supabase] CRITICAL: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. ' +
        'Check your .env file.'
    );
}

/** @deprecated Use getSupabaseBrowserClient() or getSupabaseServerClient() instead */
export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
