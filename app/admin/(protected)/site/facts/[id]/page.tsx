import { notFound } from 'next/navigation';
import { AboutFactForm } from '@/components/admin/SmallForms';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function EditAboutFactFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('about_facts').select('id,label,entries,visible').eq('id', id).maybeSingle();
  if (!data) notFound();
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">Edit about item</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <AboutFactForm fact={data as any} />
    </div>
  );
}
