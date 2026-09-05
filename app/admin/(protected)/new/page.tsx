import { ArticleForm } from '@/components/admin/ArticleForm';

export const dynamic = 'force-dynamic';

export default function NewArticlePage() {
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">New article</h1>
      <ArticleForm />
    </div>
  );
}
