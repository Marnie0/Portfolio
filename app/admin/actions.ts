'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { slugify } from '@/lib/articles';

/**
 * Every mutation re-checks the session server-side.
 *
 * The middleware already gates /admin, but a Server Action is a callable
 * endpoint in its own right — it does not inherit that protection. Checking
 * here means a request that skips the page entirely still cannot write.
 * Row Level Security is the final backstop underneath both.
 */
async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');
  return supabase;
}

export type ActionState = { error: string } | null;

/** Refresh every route that can display an article. */
function revalidateArticle(slug?: string) {
  revalidatePath('/articles');
  revalidatePath('/admin');
  if (slug) revalidatePath(`/articles/${slug}`);
}

export async function saveArticle(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await requireAdmin();

  const id = String(formData.get('id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const excerpt = String(formData.get('excerpt') ?? '').trim();
  const content = String(formData.get('content') ?? '');
  const coverImageUrl = String(formData.get('cover_image_url') ?? '').trim();
  const publish = formData.get('intent') === 'publish';

  // The slug field may be left blank, in which case derive it from the title.
  const rawSlug = String(formData.get('slug') ?? '').trim();
  const slug = slugify(rawSlug || title);

  if (!title) return { error: 'Title is required.' };
  if (!slug) return { error: 'Could not build a URL slug — add letters or numbers to the title.' };
  if (!content.trim()) return { error: 'Content is required.' };

  const values = {
    title,
    slug,
    excerpt: excerpt || null,
    content,
    cover_image_url: coverImageUrl || null,
    published: publish,
    // Stamp the publish date the first time it goes live, then leave it alone
    // so editing a published article does not reorder the list.
    ...(publish ? { published_at: new Date().toISOString() } : {}),
  };

  if (id) {
    // Preserve the original publish date on re-publish of an already-live post.
    const { data: existing } = await supabase
      .from('articles')
      .select('published_at')
      .eq('id', id)
      .maybeSingle();

    if (publish && existing?.published_at) {
      values.published_at = existing.published_at;
    }

    const { error } = await supabase.from('articles').update(values).eq('id', id);
    if (error) {
      return {
        error:
          error.code === '23505'
            ? 'Another article already uses that URL slug.'
            : `Could not save: ${error.message}`,
      };
    }
  } else {
    const { error } = await supabase.from('articles').insert(values);
    if (error) {
      return {
        error:
          error.code === '23505'
            ? 'Another article already uses that URL slug.'
            : `Could not create: ${error.message}`,
      };
    }
  }

  revalidateArticle(slug);
  redirect('/admin');
}

export async function deleteArticle(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  const { data: article } = await supabase
    .from('articles')
    .select('slug')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) {
    console.error('[admin] Failed to delete article:', error.message);
    return;
  }

  revalidateArticle(article?.slug);
}

/** Quick publish/unpublish straight from the dashboard list. */
export async function togglePublished(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = String(formData.get('id') ?? '').trim();
  const next = formData.get('next') === 'true';
  if (!id) return;

  const { data: article } = await supabase
    .from('articles')
    .select('slug, published_at')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabase
    .from('articles')
    .update({
      published: next,
      published_at: next ? (article?.published_at ?? new Date().toISOString()) : null,
    })
    .eq('id', id);

  if (error) {
    console.error('[admin] Failed to change published state:', error.message);
    return;
  }

  revalidateArticle(article?.slug);
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
