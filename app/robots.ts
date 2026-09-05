import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // The admin area is protected by auth, but there is no reason for it to be
    // crawled or indexed either.
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
