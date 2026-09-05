import { notFound } from 'next/navigation';
import { AchievementForm } from '@/components/admin/AchievementForm';
import { createServerSupabase } from '@/lib/supabase/server';
import { ACHIEVEMENT_COLUMNS, type Achievement } from '@/lib/content-db/achievements';

export const dynamic = 'force-dynamic';

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from('achievements')
    .select(ACHIEVEMENT_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">Edit achievement</h1>
      <AchievementForm achievement={data as Achievement} />
    </div>
  );
}
