import { notFound } from 'next/navigation';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { createServerSupabase } from '@/lib/supabase/server';
import { SERVICE_COLUMNS, type Service } from '@/lib/content-db/services';

export const dynamic = 'force-dynamic';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('services').select(SERVICE_COLUMNS).eq('id', id).maybeSingle();
  if (!data) notFound();
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">Edit service</h1>
      <ServiceForm service={data as Service} />
    </div>
  );
}
