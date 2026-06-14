import type { MetadataRoute } from 'next';

const BASE_URL = 'https://ai-dungeon-coral.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/collection`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/how-to-play`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
