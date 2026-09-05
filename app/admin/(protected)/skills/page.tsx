import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import {
  LANGUAGE_COLUMNS,
  SKILL_GROUP_COLUMNS,
  type SkillGroup,
  type SpokenLanguage,
} from '@/lib/content-db/skills';
import { RowControls } from '@/components/admin/RowControls';

export const dynamic = 'force-dynamic';

/** Both lists live on one screen: they render as a single section on the site. */
export default async function AdminSkillsPage() {
  const supabase = await createServerSupabase();

  const [groupsRes, langsRes] = await Promise.all([
    supabase.from('skill_groups').select(SKILL_GROUP_COLUMNS).order('sort_order'),
    supabase.from('spoken_languages').select(LANGUAGE_COLUMNS).order('sort_order'),
  ]);

  const groups = (groupsRes.data ?? []) as SkillGroup[];
  const languages = (langsRes.data ?? []) as SpokenLanguage[];

  return (
    <div className="mt-8 space-y-12">
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl">Skill groups</h1>
            <p className="mt-1 text-sm text-muted">
              {groups.length} group(s) · {groups.reduce((n, g) => n + g.skills.length, 0)} skills
            </p>
          </div>
          <Link href="/admin/skills/groups/new" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90">
            New group
          </Link>
        </div>

        <ul className="mt-6 space-y-3">
          {groups.map((row, index) => (
            <li key={row.id} className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl leading-snug">{row.title}</h2>
                    {!row.visible && <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide text-muted">Hidden</span>}
                  </div>
                  <p className="mt-2 text-sm text-muted">{row.skills.join(' · ')}</p>
                </div>
                <RowControls table="skill_groups" id={row.id} title={row.title} visible={row.visible}
                  editHref={`/admin/skills/groups/${row.id}`} isFirst={index === 0} isLast={index === groups.length - 1} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border pt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Spoken languages</h2>
            <p className="mt-1 text-sm text-muted">{languages.length} language(s)</p>
          </div>
          <Link href="/admin/skills/languages/new" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90">
            New language
          </Link>
        </div>

        <ul className="mt-6 space-y-3">
          {languages.map((row, index) => (
            <li key={row.id} className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="font-display text-lg">{row.name}</span>
                  <span className="ml-3 font-mono text-xs text-muted">{row.level}</span>
                  {!row.visible && <span className="ml-3 rounded-full bg-surface-muted px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide text-muted">Hidden</span>}
                </div>
                <RowControls table="spoken_languages" id={row.id} title={row.name} visible={row.visible}
                  editHref={`/admin/skills/languages/${row.id}`} isFirst={index === 0} isLast={index === languages.length - 1} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
