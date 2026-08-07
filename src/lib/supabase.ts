import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kgppkbdmrulgtsjaalof.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_pdJC1USIYUZ0gUmZpGCrEQ_FH6Lhbuz';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
