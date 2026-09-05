/**
 * Supabase connection settings, read defensively.
 *
 * Values are trimmed and blank-checked rather than read straight from
 * `process.env`: a variable that exists but is empty is the string '', which
 * would otherwise be passed to the client and fail at request time with an
 * opaque error. When the project is not configured at all, callers degrade to
 * an empty state instead of crashing the build.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

/** True only when both values are present, so pages can fall back safely. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Bucket created by the Part 5 storage script. */
export const ARTICLE_IMAGE_BUCKET = 'article-images';
