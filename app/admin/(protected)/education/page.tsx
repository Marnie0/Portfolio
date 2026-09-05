import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { EDUCATION_COLUMNS, type EducationEntry } from '@/lib/content-db/education';
import { RowControls } from '@/components/admin/RowControls';

export const dynamic = 'force-dynamic';

export default async function AdminEducationPage() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from('education')
    .select(EDUCATION_COLUMNS)
    .order('sort_order', { ascending: true });

  const rows = (data ?? []) as EducationEntry[];

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Education</h1>
          <p className="mt-1 text-sm text-muted">
            {rows.length} entr{rows.length === 1 ? 'y' : 'ies'} · shown in this order
          </p>
        </div>
        <Link href="/admin/education/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90">
          New entry
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">
          Could not load: {error.message}
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="mt-8 rounded-3xl border border-dashed border-border px-6 py-14 text-center text-muted">
          No education entries yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((row, index) => (
            <li key={row.id} className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-accent-text">{row.period}</span>
                    {row.location && <span className="text-xs text-muted">{row.location}</span>}
                    {!row.visible && (
                      <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide text-muted">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-display text-xl leading-snug">{row.degree}</h2>
                  <p className="mt-1 text-sm text-muted">{row.institution}</p>
                  {row.highlights.length > 0 && (
                    <p className="mt-2 text-xs text-muted">{row.highlights.length} focus tag(s)</p>
                  )}
                </div>

                <RowControls
                  table="education"
                  id={row.id}
                  title={row.degree}
                  visible={row.visible}
                  editHref={`/admin/education/${row.id}`}
                  isFirst={index === 0}
                  isLast={index === rows.length - 1}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
