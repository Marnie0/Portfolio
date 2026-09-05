import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { createServerSupabase } from '@/lib/supabase/server';
import { PROJECT_COLUMNS, type Project } from '@/lib/content-db/projects';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('projects').select(PROJECT_COLUMNS).eq('id', id).maybeSingle();
  if (!data) notFound();
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">Edit project</h1>
      <ProjectForm project={data as Project} />
    </div>
  );
}
