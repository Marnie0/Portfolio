import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from './config';

/**
 * Cookie-free client for public reads.
 *
 * Deliberately not the `@supabase/ssr` server client: without cookies these
 * queries carry no session, so Next can still statically render and revalidate
 * the public article pages. Row Level Security limits this client to published
 * articles, so it can never leak a draft.
 */
export const publicSupabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;
