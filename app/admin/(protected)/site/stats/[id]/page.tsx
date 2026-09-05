import { notFound } from 'next/navigation';
import { HeroStatForm } from '@/components/admin/SmallForms';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function EditHeroStatFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('hero_stats').select('id,value,label,visible').eq('id', id).maybeSingle();
  if (!data) notFound();
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">Edit hero stat</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <HeroStatForm stat={data as any} />
    </div>
  );
}
