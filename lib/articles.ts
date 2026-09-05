import { publicSupabase } from '@/lib/supabase/public';

/** Mirrors the `public.articles` table. */
export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** The subset the listing needs — `content` is large and unused there. */
export type ArticleSummary = Omit<Article, 'content'>;

const SUMMARY_COLUMNS =
  'id,title,slug,excerpt,cover_image_url,published,published_at,created_at,updated_at';

/**
 * Published articles, newest first.
 *
 * The `published` filter is belt-and-braces: Row Level Security already hides
 * drafts from this anonymous client, so a mistake here cannot leak one.
 */
export async function getPublishedArticles(): Promise<ArticleSummary[]> {
  if (!publicSupabase) return [];

  const { data, error } = await publicSupabase
    .from('articles')
    .select(SUMMARY_COLUMNS)
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[articles] Failed to load published articles:', error.message);
    return [];
  }

  return (data ?? []) as ArticleSummary[];
}

/** A single published article, or null when it does not exist or is a draft. */
export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  if (!publicSupabase) return null;

  const { data, error } = await publicSupabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    console.error('[articles] Failed to load article:', error.message);
    return null;
  }

  return (data as Article) ?? null;
}

/** Slugs for static generation of the article pages. */
export async function getPublishedSlugs(): Promise<string[]> {
  if (!publicSupabase) return [];

  const { data, error } = await publicSupabase
    .from('articles')
    .select('slug')
    .eq('published', true);

  if (error) return [];
  return (data ?? []).map((row) => row.slug as string);
}

/** "My First Post!" -> "my-first-post". Used to prefill the slug field. */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Dates render identically on server and client to avoid hydration drift. */
export function formatArticleDate(value: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Rough reading time, shown beside the date. */
export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}
