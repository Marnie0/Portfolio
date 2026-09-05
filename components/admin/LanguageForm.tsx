'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { saveLanguage, type ActionState } from '@/app/admin/content-actions';
import type { SpokenLanguage } from '@/lib/content-db/skills';

const input =
  'w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg transition-colors focus:border-accent';
const label = 'block text-sm font-medium text-fg';

export function LanguageForm({ language }: { language?: SpokenLanguage }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveLanguage, null);

  return (
    <form action={formAction} className="mt-8 max-w-xl space-y-5">
      {language && <input type="hidden" name="id" value={language.id} />}

      {state?.error && (
        <p role="alert" className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">{state.error}</p>
      )}

      <div>
        <label htmlFor="name" className={label}>Language</label>
        <input id="name" name="name" required defaultValue={language?.name ?? ''} className={`mt-1.5 ${input}`} />
      </div>

      <div>
        <label htmlFor="level" className={label}>
          Level <span className="font-normal text-muted">— e.g. Native, C1 · Advanced</span>
        </label>
        <input id="level" name="level" required defaultValue={language?.level ?? ''} className={`mt-1.5 ${input}`} />
      </div>

      <label className="flex items-center gap-2.5 text-sm text-fg">
        <input type="checkbox" name="visible" defaultChecked={language ? language.visible : true}
          className="h-4 w-4 rounded border-border accent-[rgb(var(--accent))]" />
        Show on the site
      </label>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <button type="submit" disabled={pending}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? 'Saving…' : 'Save'}
        </button>
        <Link href="/admin/skills" className="px-2 text-sm text-muted hover:text-fg">Cancel</Link>
      </div>
    </form>
  );
}
