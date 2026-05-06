import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Standard user-role client for frontend
if (typeof window === 'undefined') {
  console.log('--- SUPABASE SERVER INIT ---');
  console.log('URL:', supabaseUrl);
  console.log('SERVICE_KEY_PRESENT:', !!supabaseServiceKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin-role client for API routes
export const supabaseAdmin = (supabaseServiceKey && supabaseServiceKey.length > 0)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

if (typeof window === 'undefined') {
  const isUsingAdmin = (supabaseServiceKey && supabaseServiceKey.length > 0);
  console.log('CLIENT_TYPE:', isUsingAdmin ? 'ADMIN' : 'ANON');
  console.log('---------------------------');
}
