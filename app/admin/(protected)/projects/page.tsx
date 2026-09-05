import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { PROJECT_COLUMNS, type Project } from '@/lib/content-db/projects';
import { RowControls } from '@/components/admin/RowControls';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('projects').select(PROJECT_COLUMNS).order('sort_order');
  const rows = (data ?? []) as Project[];

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Projects</h1>
          <p className="mt-1 text-sm text-muted">
            {rows.length} project(s) · {rows.filter((r) => r.featured).length} featured
          </p>
        </div>
        <Link href="/admin/projects/new" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90">
          New project
        </Link>
      </div>

      {error && <p role="alert" className="mt-6 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">Could not load: {error.message}</p>}

      <ul className="mt-6 space-y-3">
        {rows.map((row, index) => (
          <li key={row.id} className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {row.featured && (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-accent-fg">
                      Featured
                    </span>
                  )}
                  <span className="font-mono text-xs text-muted">{row.category} · {row.year}</span>
                  {!row.visible && <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide text-muted">Hidden</span>}
                </div>
                <h2 className="mt-2 font-display text-xl leading-snug">{row.title}</h2>
                <p className="mt-1 text-xs text-muted">
                  {row.tech.length} tech tag(s)
                  {row.image_url ? ' · has cover image' : ' · no image'}
                  {row.live_url ? ' · live link' : ''}
                </p>
              </div>
              <RowControls table="projects" id={row.id} title={row.title} visible={row.visible}
                editHref={`/admin/projects/${row.id}`} isFirst={index === 0} isLast={index === rows.length - 1} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
