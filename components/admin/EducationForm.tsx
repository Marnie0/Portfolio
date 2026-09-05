'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { saveEducation, type ActionState } from '@/app/admin/content-actions';
import type { EducationEntry } from '@/lib/content-db/education';

const input =
  'w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg transition-colors focus:border-accent';
const label = 'block text-sm font-medium text-fg';

export function EducationForm({ entry }: { entry?: EducationEntry }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveEducation, null);

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-5">
      {entry && <input type="hidden" name="id" value={entry.id} />}

      {state?.error && (
        <p role="alert" className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="degree" className={label}>Degree or title</label>
        <input id="degree" name="degree" required defaultValue={entry?.degree ?? ''} className={`mt-1.5 ${input}`} />
      </div>

      <div>
        <label htmlFor="institution" className={label}>Institution</label>
        <input id="institution" name="institution" required defaultValue={entry?.institution ?? ''} className={`mt-1.5 ${input}`} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="period" className={label}>
            Period <span className="font-normal text-muted">— e.g. 2024 – 2028</span>
          </label>
          <input id="period" name="period" required defaultValue={entry?.period ?? ''} className={`mt-1.5 ${input}`} />
        </div>
        <div>
          <label htmlFor="location" className={label}>
            Location <span className="font-normal text-muted">— optional</span>
          </label>
          <input id="location" name="location" defaultValue={entry?.location ?? ''} className={`mt-1.5 ${input}`} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={label}>Description</label>
        <textarea id="description" name="description" rows={5} defaultValue={entry?.description ?? ''} className={`mt-1.5 resize-y ${input}`} />
      </div>

      <div>
        <label htmlFor="highlights" className={label}>
          Focus tags <span className="font-normal text-muted">— one per line</span>
        </label>
        <textarea
          id="highlights"
          name="highlights"
          rows={6}
          defaultValue={(entry?.highlights ?? []).join('\n')}
          placeholder={'Computer Science\nProblem Solving\nDatabases'}
          className={`mt-1.5 resize-y font-mono ${input}`}
        />
      </div>

      <label className="flex items-center gap-2.5 text-sm text-fg">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={entry ? entry.visible : true}
          className="h-4 w-4 rounded border-border accent-[rgb(var(--accent))]"
        />
        Show on the site
      </label>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <button type="submit" disabled={pending}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? 'Saving…' : 'Save'}
        </button>
        <Link href="/admin/education" className="px-2 text-sm text-muted hover:text-fg">Cancel</Link>
      </div>
    </form>
  );
}
