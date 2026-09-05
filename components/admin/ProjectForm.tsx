'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { saveProject, type ActionState } from '@/app/admin/content-actions';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import type { Project } from '@/lib/content-db/projects';

const CONTENT_BUCKET = 'content-images';

const input =
  'w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg transition-colors focus:border-accent';
const label = 'block text-sm font-medium text-fg';

export function ProjectForm({ project }: { project?: Project }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveProject, null);
  const [imageUrl, setImageUrl] = useState(project?.image_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onImageSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const supabase = createBrowserSupabase();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const path = `projects/${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage
      .from(CONTENT_BUCKET)
      .upload(path, file, { cacheControl: '31536000', upsert: false });

    setUploading(false);

    if (error) {
      setUploadError(
        error.message.toLowerCase().includes('bucket')
          ? `Bucket "${CONTENT_BUCKET}" not found — run the storage SQL in Supabase.`
          : `Upload failed: ${error.message}`,
      );
      return;
    }

    const { data } = supabase.storage.from(CONTENT_BUCKET).getPublicUrl(path);
    setImageUrl(data.publicUrl);
  }

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-5">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="image_url" value={imageUrl} />

      {state?.error && (
        <p role="alert" className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">{state.error}</p>
      )}

      <div>
        <label htmlFor="title" className={label}>Title</label>
        <input id="title" name="title" required defaultValue={project?.title ?? ''} className={`mt-1.5 ${input}`} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className={label}>Category</label>
          <input id="category" name="category" defaultValue={project?.category ?? ''} placeholder="UI Components" className={`mt-1.5 ${input}`} />
        </div>
        <div>
          <label htmlFor="year" className={label}>Year</label>
          <input id="year" name="year" defaultValue={project?.year ?? ''} className={`mt-1.5 ${input}`} />
        </div>
      </div>

      <div>
        <label htmlFor="summary" className={label}>Summary</label>
        <textarea id="summary" name="summary" rows={3} defaultValue={project?.summary ?? ''} className={`mt-1.5 resize-y ${input}`} />
      </div>

      <div>
        <label htmlFor="focus" className={label}>
          What it covers <span className="font-normal text-muted">— the highlighted block</span>
        </label>
        <textarea id="focus" name="focus" rows={3} defaultValue={project?.focus ?? ''} className={`mt-1.5 resize-y ${input}`} />
      </div>

      <div>
        <label htmlFor="tech" className={label}>
          Tech tags <span className="font-normal text-muted">— one per line</span>
        </label>
        <textarea id="tech" name="tech" rows={4} defaultValue={(project?.tech ?? []).join('\n')}
          placeholder={'HTML5\nCSS3\nJavaScript'} className={`mt-1.5 resize-y font-mono ${input}`} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="live_url" className={label}>Live URL</label>
          <input id="live_url" name="live_url" type="url" defaultValue={project?.live_url ?? ''} className={`mt-1.5 ${input}`} />
        </div>
        <div>
          <label htmlFor="github_url" className={label}>GitHub URL</label>
          <input id="github_url" name="github_url" type="url" defaultValue={project?.github_url ?? ''} className={`mt-1.5 ${input}`} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <p className={label}>Cover image</p>
        {imageUrl ? (
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" className="h-24 w-40 rounded-xl border border-border object-cover" />
            <button type="button" onClick={() => setImageUrl('')}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-fg">
              Remove
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">No cover image.</p>
        )}

        <label className="mt-3 inline-block cursor-pointer rounded-full border border-border px-4 py-2 text-sm text-fg transition-colors hover:bg-surface-muted">
          {uploading ? 'Uploading…' : imageUrl ? 'Replace image' : 'Upload image'}
          <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={onImageSelected} />
        </label>

        <p className="mt-3 text-xs text-muted">
          Existing projects point at files in <code>/public</code>; new uploads go to Supabase Storage.
          Either works.
        </p>

        {uploadError && <p role="alert" className="mt-3 text-sm text-accent-text">{uploadError}</p>}

        <div className="mt-4">
          <label htmlFor="image_alt" className={label}>
            Alt text <span className="font-normal text-muted">— describes the image for screen readers</span>
          </label>
          <input id="image_alt" name="image_alt" defaultValue={project?.image_alt ?? ''} className={`mt-1.5 ${input}`} />
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="flex items-center gap-2.5 text-sm text-fg">
          <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false}
            className="h-4 w-4 rounded border-border accent-[rgb(var(--accent))]" />
          Featured — shown large at the top instead of in the grid
        </label>
        <label className="flex items-center gap-2.5 text-sm text-fg">
          <input type="checkbox" name="visible" defaultChecked={project ? project.visible : true}
            className="h-4 w-4 rounded border-border accent-[rgb(var(--accent))]" />
          Show on the site
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <button type="submit" disabled={pending || uploading}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? 'Saving…' : 'Save'}
        </button>
        <Link href="/admin/projects" className="px-2 text-sm text-muted hover:text-fg">Cancel</Link>
      </div>
    </form>
  );
}
