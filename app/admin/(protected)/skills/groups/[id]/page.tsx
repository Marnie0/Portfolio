import { notFound } from 'next/navigation';
import { SkillGroupForm } from '@/components/admin/SkillGroupForm';
import { createServerSupabase } from '@/lib/supabase/server';
import { SKILL_GROUP_COLUMNS, type SkillGroup } from '@/lib/content-db/skills';

export const dynamic = 'force-dynamic';

export default async function EditSkillGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('skill_groups').select(SKILL_GROUP_COLUMNS).eq('id', id).maybeSingle();
  if (!data) notFound();
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">Edit skill group</h1>
      <SkillGroupForm group={data as SkillGroup} />
    </div>
  );
}
