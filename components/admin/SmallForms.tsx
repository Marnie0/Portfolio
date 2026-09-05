'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import {
  saveAboutFact,
  saveHeroStat,
  saveSocialLink,
  type ActionState,
} from '@/app/admin/content-actions';
import type { AboutFact, HeroStat, SocialLink } from '@/lib/content-db/settings';

const input =
  'w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg transition-colors focus:border-accent';
const label = 'block text-sm font-medium text-fg';
const actions = 'flex flex-wrap items-center gap-3 border-t border-border pt-5';
const submit =
  'rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60';

function Error({ state }: { state: ActionState }) {
  if (!state?.error) return null;
  return (
    <p role="alert" className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">
      {state.error}
    </p>
  );
}

function VisibleToggle({ checked }: { checked: boolean }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-fg">
      <input type="checkbox" name="visible" defaultChecked={checked}
        className="h-4 w-4 rounded border-border accent-[rgb(var(--accent))]" />
      Show on the site
    </label>
  );
}

export function AboutFactForm({ fact }: { fact?: AboutFact & { visible?: boolean } }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveAboutFact, null);
  return (
    <form action={formAction} className="mt-8 max-w-xl space-y-5">
      {fact && <input type="hidden" name="id" value={fact.id} />}
      <Error state={state} />
      <div>
        <label htmlFor="label" className={label}>Label</label>
        <input id="label" name="label" required defaultValue={fact?.label ?? ''} placeholder="Based in" className={`mt-1.5 ${input}`} />
      </div>
      <div>
        <label htmlFor="entries" className={label}>
          Value <span className="font-normal text-muted">— one per line; a single line renders inline, several stack</span>
        </label>
        <textarea id="entries" name="entries" rows={4} required
          defaultValue={(fact?.entries ?? []).join('\n')}
          placeholder={'Full-Stack\nBackend\nReact'}
          className={`mt-1.5 resize-y font-mono ${input}`} />
      </div>
      <VisibleToggle checked={fact?.visible ?? true} />
      <div className={actions}>
        <button type="submit" disabled={pending} className={submit}>{pending ? 'Saving…' : 'Save'}</button>
        <Link href="/admin/site" className="px-2 text-sm text-muted hover:text-fg">Cancel</Link>
      </div>
    </form>
  );
}

export function HeroStatForm({ stat }: { stat?: HeroStat & { visible?: boolean } }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveHeroStat, null);
  return (
    <form action={formAction} className="mt-8 max-w-xl space-y-5">
      {stat && <input type="hidden" name="id" value={stat.id} />}
      <Error state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="value" className={label}>Number</label>
          <input id="value" name="value" required defaultValue={stat?.value ?? ''} placeholder="10+" className={`mt-1.5 ${input}`} />
        </div>
        <div>
          <label htmlFor="label" className={label}>Label</label>
          <input id="label" name="label" required defaultValue={stat?.label ?? ''} placeholder="Projects" className={`mt-1.5 ${input}`} />
        </div>
      </div>
      <VisibleToggle checked={stat?.visible ?? true} />
      <div className={actions}>
        <button type="submit" disabled={pending} className={submit}>{pending ? 'Saving…' : 'Save'}</button>
        <Link href="/admin/site" className="px-2 text-sm text-muted hover:text-fg">Cancel</Link>
      </div>
    </form>
  );
}

const SOCIAL_ICON_OPTIONS = ['github', 'linkedin', 'whatsapp', 'mail', 'external'] as const;

export function SocialLinkForm({ link }: { link?: SocialLink & { visible?: boolean } }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveSocialLink, null);
  return (
    <form action={formAction} className="mt-8 max-w-xl space-y-5">
      {link && <input type="hidden" name="id" value={link.id} />}
      <Error state={state} />
      <div>
        <label htmlFor="label" className={label}>Label</label>
        <input id="label" name="label" required defaultValue={link?.label ?? ''} placeholder="GitHub" className={`mt-1.5 ${input}`} />
      </div>
      <div>
        <label htmlFor="url" className={label}>URL</label>
        <input id="url" name="url" type="url" required defaultValue={link?.url ?? ''} className={`mt-1.5 ${input}`} />
      </div>
      <div>
        <label htmlFor="display" className={label}>
          Display text <span className="font-normal text-muted">— shown in the contact list, e.g. @Marnie0</span>
        </label>
        <input id="display" name="display" defaultValue={link?.display ?? ''} className={`mt-1.5 ${input}`} />
      </div>
      <div>
        <label htmlFor="icon" className={label}>Icon</label>
        <select id="icon" name="icon" defaultValue={link?.icon ?? 'external'} className={`mt-1.5 ${input}`}>
          {SOCIAL_ICON_OPTIONS.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>
      <VisibleToggle checked={link?.visible ?? true} />
      <div className={actions}>
        <button type="submit" disabled={pending} className={submit}>{pending ? 'Saving…' : 'Save'}</button>
        <Link href="/admin/site" className="px-2 text-sm text-muted hover:text-fg">Cancel</Link>
      </div>
    </form>
  );
}
