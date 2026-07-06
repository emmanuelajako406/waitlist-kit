import { MetadataRoute } from 'next';
import { WAITLIST_CONTENT } from '@/content/WaitList';


export default function sitemap(): MetadataRoute.Sitemap {
  // Define your static routes
  const routes = [
    '',          // Home route 
  ];

  return routes.map((route) => ({
    url: `${WAITLIST_CONTENT.seo.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8, // Home page gets top search priority
  }));
}