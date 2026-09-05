'use client';

import { useActionState } from 'react';
import { saveSiteSettings, type ActionState } from '@/app/admin/content-actions';
import type { SiteSettings } from '@/lib/content-db/settings';

const input =
  'w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg transition-colors focus:border-accent';
const label = 'block text-sm font-medium text-fg';

function Field({
  name,
  title,
  hint,
  value,
  type = 'text',
}: {
  name: keyof SiteSettings;
  title: string;
  hint?: string;
  value: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={label}>
        {title} {hint && <span className="font-normal text-muted">— {hint}</span>}
      </label>
      <input id={name} name={name} type={type} defaultValue={value} className={`mt-1.5 ${input}`} />
    </div>
  );
}

/** Grouped by where each field appears, so the form reads like the page. */
export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveSiteSettings,
    null,
  );

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-10">
      {state?.error && (
        <p role="alert" className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">
          {state.error}
        </p>
      )}

      <fieldset className="space-y-5">
        <legend className="font-display text-xl">Identity</legend>
        <Field name="name" title="Full name" hint="the large hero heading" value={settings.name} />
        <Field name="short_name" title="Short name" hint="beside the logo in the navbar" value={settings.short_name} />
        <Field name="role" title="Role" hint="the line under your name" value={settings.role} />
        <Field name="tagline" title="Tagline" hint="shown in the footer" value={settings.tagline} />
        <div>
          <label htmlFor="description" className={label}>
            SEO description <span className="font-normal text-muted">— search results and link previews</span>
          </label>
          <textarea id="description" name="description" rows={3} defaultValue={settings.description} className={`mt-1.5 resize-y ${input}`} />
        </div>
        <Field name="location" title="Location" value={settings.location} />
        <Field name="availability" title="Availability" hint="the pill at the top of the hero" value={settings.availability} />
      </fieldset>

      <fieldset className="space-y-5 border-t border-border pt-8">
        <legend className="font-display text-xl">Contact details</legend>
        <Field name="email" title="Email" type="email" value={settings.email} />
        <Field name="phone_display" title="Phone (displayed)" hint="e.g. +20 107 043 9165" value={settings.phone_display} />
        <Field name="phone_tel" title="Phone (dial)" hint="digits only, used by tel:" value={settings.phone_tel} />
        <Field name="whatsapp_url" title="WhatsApp URL" hint="https://wa.me/…" value={settings.whatsapp_url} />
        <Field name="resume_url" title="CV / résumé path" hint="e.g. /CV.pdf" value={settings.resume_url} />
      </fieldset>

      <fieldset className="space-y-5 border-t border-border pt-8">
        <legend className="font-display text-xl">Hero buttons</legend>
        <Field name="hero_cta_primary" title="Primary button" value={settings.hero_cta_primary} />
        <Field name="hero_cta_secondary" title="Secondary button" value={settings.hero_cta_secondary} />
        <Field name="hero_resume_label" title="Résumé link" value={settings.hero_resume_label} />
      </fieldset>

      <fieldset className="space-y-5 border-t border-border pt-8">
        <legend className="font-display text-xl">About section</legend>
        <Field name="about_eyebrow" title="Eyebrow" hint="the small label above the heading" value={settings.about_eyebrow} />
        <div>
          <label htmlFor="about_lead" className={label}>Headline</label>
          <textarea id="about_lead" name="about_lead" rows={2} defaultValue={settings.about_lead} className={`mt-1.5 resize-y ${input}`} />
        </div>
        <div>
          <label htmlFor="about_paragraphs" className={label}>
            Bio paragraphs <span className="font-normal text-muted">— one paragraph per line</span>
          </label>
          <textarea id="about_paragraphs" name="about_paragraphs" rows={12}
            defaultValue={settings.about_paragraphs.join('\n')}
            className={`mt-1.5 resize-y ${input}`} />
          <p className="mt-1.5 text-xs text-muted">
            Each line becomes its own paragraph. Blank lines are ignored, so do not double-space.
          </p>
        </div>
      </fieldset>

      <fieldset className="space-y-5 border-t border-border pt-8">
        <legend className="font-display text-xl">Contact section</legend>
        <Field name="contact_eyebrow" title="Eyebrow" value={settings.contact_eyebrow} />
        <Field name="contact_title" title="Heading" value={settings.contact_title} />
        <div>
          <label htmlFor="contact_description" className={label}>Description</label>
          <textarea id="contact_description" name="contact_description" rows={3} defaultValue={settings.contact_description} className={`mt-1.5 resize-y ${input}`} />
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <button type="submit" disabled={pending}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  );
}
