import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';
import { getPublishedArticles } from '@/lib/articles';

/** Rebuilt on the same cadence as the pages it lists. */
export const revalidate = 60;

/**
 * Home page, the article index, and every published article.
 *
 * The article entries matter: without them a new post is only discoverable by
 * crawling a link from /articles. `getPublishedArticles()` returns published
 * rows only, so drafts can never leak into the sitemap, and it falls back to an
 * empty list if Supabase is unreachable rather than failing the build.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();

  const latestArticleChange = articles.length
    ? new Date(
        Math.max(...articles.map((a) => new Date(a.updated_at).getTime())),
      )
    : new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/articles`,
      lastModified: latestArticleChange,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${siteConfig.url}/articles/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
