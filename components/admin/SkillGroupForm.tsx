'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { saveSkillGroup, type ActionState } from '@/app/admin/content-actions';
import type { SkillGroup } from '@/lib/content-db/skills';

const input =
  'w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg transition-colors focus:border-accent';
const label = 'block text-sm font-medium text-fg';

export function SkillGroupForm({ group }: { group?: SkillGroup }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveSkillGroup, null);

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-5">
      {group && <input type="hidden" name="id" value={group.id} />}

      {state?.error && (
        <p role="alert" className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">{state.error}</p>
      )}

      <div>
        <label htmlFor="title" className={label}>Group title</label>
        <input id="title" name="title" required defaultValue={group?.title ?? ''} className={`mt-1.5 ${input}`} />
      </div>

      <div>
        <label htmlFor="skills" className={label}>
          Skills <span className="font-normal text-muted">— one per line, shown as chips in this order</span>
        </label>
        <textarea id="skills" name="skills" rows={8}
          defaultValue={(group?.skills ?? []).join('\n')}
          placeholder={'HTML5\nCSS3\nReact\nNext.js'}
          className={`mt-1.5 resize-y font-mono ${input}`} />
      </div>

      <label className="flex items-center gap-2.5 text-sm text-fg">
        <input type="checkbox" name="visible" defaultChecked={group ? group.visible : true}
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
