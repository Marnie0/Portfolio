import { notFound } from 'next/navigation';
import { SocialLinkForm } from '@/components/admin/SmallForms';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function EditSocialLinkFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('social_links').select('id,label,url,icon,display,visible').eq('id', id).maybeSingle();
  if (!data) notFound();
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">Edit social link</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <SocialLinkForm link={data as any} />
    </div>
  );
}
