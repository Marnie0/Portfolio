'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { saveAchievement, type ActionState } from '@/app/admin/content-actions';
import type { Achievement } from '@/lib/content-db/achievements';

const input =
  'w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg transition-colors focus:border-accent';
const label = 'block text-sm font-medium text-fg';

export function AchievementForm({ achievement }: { achievement?: Achievement }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveAchievement,
    null,
  );

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-5">
      {achievement && <input type="hidden" name="id" value={achievement.id} />}

      {state?.error && (
        <p role="alert" className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" className={label}>Title</label>
        <input id="title" name="title" required defaultValue={achievement?.title ?? ''} className={`mt-1.5 ${input}`} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="issuer" className={label}>Issuer</label>
          <input id="issuer" name="issuer" defaultValue={achievement?.issuer ?? ''} className={`mt-1.5 ${input}`} />
        </div>
        <div>
          <label htmlFor="year" className={label}>
            Year <span className="font-normal text-muted">— free text, e.g. &ldquo;Ongoing&rdquo;</span>
          </label>
          <input id="year" name="year" defaultValue={achievement?.year ?? ''} className={`mt-1.5 ${input}`} />
        </div>
      </div>

      <div>
        <label htmlFor="type" className={label}>
          Category <span className="font-normal text-muted">— keep it short, it renders as a badge</span>
        </label>
        <input id="type" name="type" defaultValue={achievement?.type ?? ''} className={`mt-1.5 ${input}`} />
      </div>

      <div>
        <label htmlFor="description" className={label}>Description</label>
        <textarea id="description" name="description" rows={4} defaultValue={achievement?.description ?? ''} className={`mt-1.5 resize-y ${input}`} />
      </div>

      <label className="flex items-center gap-2.5 text-sm text-fg">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={achievement ? achievement.visible : true}
          className="h-4 w-4 rounded border-border accent-[rgb(var(--accent))]"
        />
        Show on the site
      </label>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
        <Link href="/admin/achievements" className="px-2 text-sm text-muted hover:text-fg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
