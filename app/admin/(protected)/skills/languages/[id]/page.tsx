import { notFound } from 'next/navigation';
import { LanguageForm } from '@/components/admin/LanguageForm';
import { createServerSupabase } from '@/lib/supabase/server';
import { LANGUAGE_COLUMNS, type SpokenLanguage } from '@/lib/content-db/skills';

export const dynamic = 'force-dynamic';

export default async function EditLanguagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('spoken_languages').select(LANGUAGE_COLUMNS).eq('id', id).maybeSingle();
  if (!data) notFound();
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">Edit language</h1>
      <LanguageForm language={data as SpokenLanguage} />
    </div>
  );
}
