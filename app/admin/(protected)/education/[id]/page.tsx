import { notFound } from 'next/navigation';
import { EducationForm } from '@/components/admin/EducationForm';
import { createServerSupabase } from '@/lib/supabase/server';
import { EDUCATION_COLUMNS, type EducationEntry } from '@/lib/content-db/education';

export const dynamic = 'force-dynamic';

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('education').select(EDUCATION_COLUMNS).eq('id', id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">Edit education entry</h1>
      <EducationForm entry={data as EducationEntry} />
    </div>
  );
}
