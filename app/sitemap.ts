import { MetadataRoute } from 'next'
import { featuredProducts } from '@/lib/data/figure-data'
import { featuredManga } from '@/lib/data/manga-data'
import { featuredPlushies } from '@/lib/data/plushie-data'
import type { Figure } from '@/lib/types/figure'
import type { Manga } from '@/lib/types/manga'
import type { Plushie } from '@/lib/types/plushie'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pkt-store.vercel.app'

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/cart',
    '/figures',
    '/manga',
    '/plushies',
  ]

  const staticUrls = staticPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: page === '' ? 1 : 0.8,
  }))

  // Dynamic figure pages
  const figureUrls = featuredProducts.map((figure: Figure) => ({
    url: `${baseUrl}/figures/${figure.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Dynamic manga pages
  const mangaUrls = featuredManga.map((manga: Manga) => ({
    url: `${baseUrl}/manga/${manga.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Dynamic plushie pages
  const plushieUrls = featuredPlushies.map((plushie: Plushie) => ({
    url: `${baseUrl}/plushies/${plushie.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    ...staticUrls,
    ...figureUrls,
    ...mangaUrls,
    ...plushieUrls,
  ]
}
