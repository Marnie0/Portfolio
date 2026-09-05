import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { SERVICE_COLUMNS, type Service } from '@/lib/content-db/services';
import { RowControls } from '@/components/admin/RowControls';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('services').select(SERVICE_COLUMNS).order('sort_order');
  const rows = (data ?? []) as Service[];

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Services</h1>
          <p className="mt-1 text-sm text-muted">{rows.length} service(s) · shown in this order</p>
        </div>
        <Link href="/admin/services/new" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90">
          New service
        </Link>
      </div>

      {error && <p role="alert" className="mt-6 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">Could not load: {error.message}</p>}

      <ul className="mt-6 space-y-3">
        {rows.map((row, index) => (
          <li key={row.id} className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-surface-muted px-2.5 py-0.5 font-mono text-[0.7rem] text-muted">{row.icon}</span>
                  {!row.visible && <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide text-muted">Hidden</span>}
                </div>
                <h2 className="mt-2 font-display text-xl leading-snug">{row.title}</h2>
                <p className="mt-1 text-sm text-muted">{row.deliverables.length} deliverable(s)</p>
              </div>
              <RowControls table="services" id={row.id} title={row.title} visible={row.visible}
                editHref={`/admin/services/${row.id}`} isFirst={index === 0} isLast={index === rows.length - 1} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
