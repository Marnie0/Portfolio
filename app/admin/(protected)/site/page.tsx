import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { fallbackSettings, type SiteSettings } from '@/lib/content-db/settings';
import { SiteSettingsForm } from '@/components/admin/SiteSettingsForm';
import { RowControls } from '@/components/admin/RowControls';

export const dynamic = 'force-dynamic';

type Fact = { id: string; label: string; entries: string[]; visible: boolean };
type Stat = { id: string; value: string; label: string; visible: boolean };
type Social = { id: string; label: string; url: string; icon: string; display: string; visible: boolean };

export default async function AdminSitePage() {
  const supabase = await createServerSupabase();

  const [settingsRes, factsRes, statsRes, socialsRes] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('about_facts').select('id,label,entries,visible').order('sort_order'),
    supabase.from('hero_stats').select('id,value,label,visible').order('sort_order'),
    supabase.from('social_links').select('id,label,url,icon,display,visible').order('sort_order'),
  ]);

  // A brand-new database has no row yet; show the defaults so the form works.
  const settings = (settingsRes.data as SiteSettings | null) ?? fallbackSettings();
  const facts = (factsRes.data ?? []) as Fact[];
  const stats = (statsRes.data ?? []) as Stat[];
  const socials = (socialsRes.data ?? []) as Social[];

  return (
    <div className="mt-8 space-y-14">
      <section>
        <h1 className="font-display text-2xl">Hero, About &amp; Contact</h1>
        <p className="mt-1 text-sm text-muted">
          These fields appear across the whole site, including the browser title and search results.
        </p>
        <SiteSettingsForm settings={settings} />
      </section>

      <section className="border-t border-border pt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">About meta row</h2>
            <p className="mt-1 text-sm text-muted">{facts.length} item(s) under your bio</p>
          </div>
          <Link href="/admin/site/facts/new" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90">New item</Link>
        </div>
        <ul className="mt-6 space-y-3">
          {facts.map((row, i) => (
            <li key={row.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-xs uppercase tracking-[0.14em] text-muted">{row.label}</span>
                  <p className="mt-1 text-sm font-medium text-fg">{row.entries.join(' · ')}</p>
                  {!row.visible && <span className="mt-1 inline-block rounded-full bg-surface-muted px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide text-muted">Hidden</span>}
                </div>
                <RowControls table="about_facts" id={row.id} title={row.label} visible={row.visible}
                  editHref={`/admin/site/facts/${row.id}`} isFirst={i === 0} isLast={i === facts.length - 1} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border pt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Hero stats</h2>
            <p className="mt-1 text-sm text-muted">{stats.length} stat(s)</p>
          </div>
          <Link href="/admin/site/stats/new" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90">New stat</Link>
        </div>
        <ul className="mt-6 space-y-3">
          {stats.map((row, i) => (
            <li key={row.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="font-display text-xl">{row.value}</span>
                  <span className="ml-3 text-sm text-muted">{row.label}</span>
                  {!row.visible && <span className="ml-3 rounded-full bg-surface-muted px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide text-muted">Hidden</span>}
                </div>
                <RowControls table="hero_stats" id={row.id} title={row.label} visible={row.visible}
                  editHref={`/admin/site/stats/${row.id}`} isFirst={i === 0} isLast={i === stats.length - 1} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border pt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Social links</h2>
            <p className="mt-1 text-sm text-muted">
              {socials.length} link(s) · used in the hero, footer, contact list and search metadata
            </p>
          </div>
          <Link href="/admin/site/socials/new" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90">New link</Link>
        </div>
        <ul className="mt-6 space-y-3">
          {socials.map((row, i) => (
            <li key={row.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-fg">{row.label}</span>
                  <span className="ml-3 font-mono text-xs text-muted">{row.display || row.url}</span>
                  {!row.visible && <span className="ml-3 rounded-full bg-surface-muted px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide text-muted">Hidden</span>}
                </div>
                <RowControls table="social_links" id={row.id} title={row.label} visible={row.visible}
                  editHref={`/admin/site/socials/${row.id}`} isFirst={i === 0} isLast={i === socials.length - 1} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
