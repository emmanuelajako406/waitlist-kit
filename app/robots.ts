import { MetadataRoute } from 'next';

import { WAITLIST_CONTENT } from '@/content/WaitList';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Applies rules to all web crawler bots
      allow: '/',     // Allow indexing of public frontend structures
      disallow: [
        '/api/',      // Block scraping backend server endpoints
      ],
    },
    sitemap: `${WAITLIST_CONTENT.seo.url}/sitemap.xml`,
  };
}