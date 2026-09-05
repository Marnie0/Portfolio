import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { ACHIEVEMENT_COLUMNS, type Achievement } from '@/lib/content-db/achievements';
import { RowControls } from '@/components/admin/RowControls';

export const dynamic = 'force-dynamic';

export default async function AdminAchievementsPage() {
  const supabase = await createServerSupabase();

  // "admin reads all" lets a signed-in user see hidden rows too.
  const { data, error } = await supabase
    .from('achievements')
    .select(ACHIEVEMENT_COLUMNS)
    .order('sort_order', { ascending: true });

  const rows = (data ?? []) as Achievement[];

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Achievements</h1>
          <p className="mt-1 text-sm text-muted">
            {rows.length} entr{rows.length === 1 ? 'y' : 'ies'} · shown on the home page in this
            order
          </p>
        </div>
        <Link
          href="/admin/achievements/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          New achievement
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">
          Could not load: {error.message}
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="mt-8 rounded-3xl border border-dashed border-border px-6 py-14 text-center text-muted">
          No achievements yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((row, index) => (
            <li key={row.id} className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide text-accent-text">
                      {row.type || 'No category'}
                    </span>
                    <span className="font-mono text-xs text-muted">{row.year}</span>
                    {!row.visible && (
                      <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide text-muted">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-display text-xl leading-snug">{row.title}</h2>
                  <p className="mt-1 text-sm text-muted">{row.issuer}</p>
                </div>

                <RowControls
                  table="achievements"
                  id={row.id}
                  title={row.title}
                  visible={row.visible}
                  editHref={`/admin/achievements/${row.id}`}
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
