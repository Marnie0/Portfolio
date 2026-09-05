'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { saveService, type ActionState } from '@/app/admin/content-actions';
import { SERVICE_ICONS, type Service } from '@/lib/content-db/services';

const input =
  'w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg transition-colors focus:border-accent';
const label = 'block text-sm font-medium text-fg';

export function ServiceForm({ service }: { service?: Service }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveService, null);

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-5">
      {service && <input type="hidden" name="id" value={service.id} />}

      {state?.error && (
        <p role="alert" className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" className={label}>Title</label>
        <input id="title" name="title" required defaultValue={service?.title ?? ''} className={`mt-1.5 ${input}`} />
      </div>

      <div>
        <label htmlFor="description" className={label}>Description</label>
        <textarea id="description" name="description" rows={4} defaultValue={service?.description ?? ''} className={`mt-1.5 resize-y ${input}`} />
      </div>

      <div>
        <label htmlFor="deliverables" className={label}>
          Deliverables <span className="font-normal text-muted">— one per line, shown as a checklist</span>
        </label>
        <textarea
          id="deliverables"
          name="deliverables"
          rows={5}
          defaultValue={(service?.deliverables ?? []).join('\n')}
          placeholder={'Component architecture\nTypeScript throughout\nAPI integration'}
          className={`mt-1.5 resize-y font-mono ${input}`}
        />
      </div>

      <div>
        {/* A select, not a text field: an unknown key would render a blank icon. */}
        <label htmlFor="icon" className={label}>Icon</label>
        <select id="icon" name="icon" defaultValue={service?.icon ?? 'code'} className={`mt-1.5 ${input}`}>
          {SERVICE_ICONS.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2.5 text-sm text-fg">
        <input type="checkbox" name="visible" defaultChecked={service ? service.visible : true}
          className="h-4 w-4 rounded border-border accent-[rgb(var(--accent))]" />
        Show on the site
      </label>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <button type="submit" disabled={pending}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? 'Saving…' : 'Save'}
        </button>
        <Link href="/admin/services" className="px-2 text-sm text-muted hover:text-fg">Cancel</Link>
      </div>
    </form>
  );
}
