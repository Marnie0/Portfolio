'use client';

import { useActionState, useRef, useState } from 'react';
import Link from 'next/link';
import { Markdown } from '@/components/articles/Markdown';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { ARTICLE_IMAGE_BUCKET } from '@/lib/supabase/config';
import { slugify, type Article } from '@/lib/articles';
import { saveArticle, type ActionState } from '@/app/admin/actions';

const inputClass =
  'w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg transition-colors duration-200 focus:border-accent';

const labelClass = 'block text-sm font-medium text-fg';

type Props = { article?: Article };

export function ArticleForm({ article }: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveArticle, null);

  const [title, setTitle] = useState(article?.title ?? '');
  const [slug, setSlug] = useState(article?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(article?.slug));
  const [content, setContent] = useState(article?.content ?? '');
  const [coverUrl, setCoverUrl] = useState(article?.cover_image_url ?? '');
  const [view, setView] = useState<'write' | 'preview'>('write');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  /** Keep the slug in step with the title until the slug is edited by hand. */
  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    setUploadError(null);

    const supabase = createBrowserSupabase();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const path = `${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage
      .from(ARTICLE_IMAGE_BUCKET)
      .upload(path, file, { cacheControl: '31536000', upsert: false });

    setUploading(false);

    if (error) {
      setUploadError(
        error.message.toLowerCase().includes('bucket')
          ? `Storage bucket "${ARTICLE_IMAGE_BUCKET}" not found — run the storage SQL in Supabase.`
          : `Upload failed: ${error.message}`,
      );
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(ARTICLE_IMAGE_BUCKET).getPublicUrl(path);

    return publicUrl;
  }

  async function onCoverSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const url = await upload(file);
    if (url) setCoverUrl(url);
  }

  /** Uploads, then drops the markdown at the caret rather than at the end. */
  async function onInlineImageSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const url = await upload(file);
    if (!url) return;

    const snippet = `\n\n![${file.name.replace(/\.[^.]+$/, '')}](${url})\n\n`;
    const textarea = contentRef.current;
    const at = textarea?.selectionStart ?? content.length;
    setContent(content.slice(0, at) + snippet + content.slice(at));
  }

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {article && <input type="hidden" name="id" value={article.id} />}
      <input type="hidden" name="cover_image_url" value={coverUrl} />
      <input type="hidden" name="content" value={content} />

      {state?.error && (
        <p role="alert" className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className={`mt-1.5 ${inputClass}`}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="slug" className={labelClass}>
            URL slug
          </label>
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            className={`mt-1.5 font-mono ${inputClass}`}
          />
          <p className="mt-1.5 text-xs text-muted">/articles/{slugify(slug || title) || '…'}</p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="excerpt" className={labelClass}>
            Excerpt <span className="font-normal text-muted">— shown on the articles list</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={article?.excerpt ?? ''}
            className={`mt-1.5 resize-y ${inputClass}`}
          />
        </div>
      </div>

      {/* Cover image */}
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <p className={labelClass}>Cover image</p>

        {coverUrl ? (
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {/* Plain <img>: this is admin-only chrome, and next/image would
                need the host allow-listed before the first upload exists. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt="Cover preview"
              className="h-24 w-40 rounded-xl border border-border object-cover"
            />
            <button
              type="button"
              onClick={() => setCoverUrl('')}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-fg"
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">No cover image yet.</p>
        )}

        <label className="mt-3 inline-block cursor-pointer rounded-full border border-border px-4 py-2 text-sm text-fg transition-colors hover:bg-surface-muted">
          {uploading ? 'Uploading…' : coverUrl ? 'Replace image' : 'Upload image'}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploading}
            onChange={onCoverSelected}
          />
        </label>

        {uploadError && (
          <p role="alert" className="mt-3 text-sm text-accent-text">
            {uploadError}
          </p>
        )}
      </div>

      {/* Editor */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={labelClass}>Content — Markdown</p>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer rounded-full border border-border px-3.5 py-1.5 text-xs text-fg transition-colors hover:bg-surface-muted">
              {uploading ? 'Uploading…' : 'Insert image'}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploading}
                onChange={onInlineImageSelected}
              />
            </label>

            {/* Tabs only matter below lg, where the panes stack. */}
            <div className="flex rounded-full border border-border p-0.5 lg:hidden">
              {(['write', 'preview'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setView(mode)}
                  className={[
                    'rounded-full px-3 py-1 text-xs capitalize transition-colors',
                    view === mode ? 'bg-accent text-accent-fg' : 'text-muted',
                  ].join(' ')}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 grid gap-4 lg:grid-cols-2">
          <div className={view === 'write' ? '' : 'hidden lg:block'}>
            <textarea
              ref={contentRef}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={22}
              spellCheck
              placeholder={'## A heading\n\nSome text, **bold**, a [link](https://example.com).\n\n```ts\nconst x = 1;\n```'}
              className="w-full rounded-xl border border-border bg-bg p-4 font-mono text-sm leading-relaxed text-fg transition-colors focus:border-accent"
            />
          </div>

          <div className={view === 'preview' ? '' : 'hidden lg:block'}>
            <div className="h-full min-h-[12rem] overflow-x-auto rounded-xl border border-border bg-surface p-5">
              {content.trim() ? (
                <Markdown content={content} />
              ) : (
                <p className="text-sm text-muted">Preview appears here.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          name="intent"
          value="publish"
          disabled={pending || uploading}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Publish'}
        </button>

        <button
          type="submit"
          name="intent"
          value="draft"
          disabled={pending || uploading}
          className="rounded-full border border-border px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save as draft
        </button>

        <Link href="/admin" className="px-2 text-sm text-muted hover:text-fg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
