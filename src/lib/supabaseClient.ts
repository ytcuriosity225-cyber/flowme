import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL - Supabase will not function');
}
if (!supabaseAnonKey) {
  console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY - Supabase will not function');
}

// Fallback to empty strings to avoid createClient crash during build
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

// Standard user-role client for frontend
if (typeof window === 'undefined') {
  console.log('--- SUPABASE SERVER INIT ---');
  console.log('URL:', supabaseUrl);
  console.log('SERVICE_KEY_PRESENT:', !!supabaseServiceKey);
}

export const supabase = createClient(url, key);

// Admin-role client for API routes
export const supabaseAdmin = (supabaseServiceKey && supabaseServiceKey.length > 0)
  ? createClient(url, supabaseServiceKey)
  : supabase;

if (typeof window === 'undefined') {
  const isUsingAdmin = (supabaseServiceKey && supabaseServiceKey.length > 0);
  console.log('CLIENT_TYPE:', isUsingAdmin ? 'ADMIN' : 'ANON');
  console.log('---------------------------');
}
