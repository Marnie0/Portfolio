import { notFound } from 'next/navigation';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { createServerSupabase } from '@/lib/supabase/server';
import type { Article } from '@/lib/articles';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data } = await supabase.from('articles').select('*').eq('id', id).maybeSingle();

  if (!data) notFound();

  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">Edit article</h1>
      <ArticleForm article={data as Article} />
    </div>
  );
}
