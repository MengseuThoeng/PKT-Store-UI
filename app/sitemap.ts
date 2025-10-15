import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  try {
    // Fetch products from database
    const [figuresRes, mangaRes, plushiesRes] = await Promise.all([
      fetch(`${baseUrl}/api/products/figures`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/products/manga`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/products/plushies`, { next: { revalidate: 3600 } }),
    ])

    const [figuresData, mangaData, plushiesData] = await Promise.all([
      figuresRes.json(),
      mangaRes.json(),
      plushiesRes.json(),
    ])

    // Dynamic figure pages
    const figureUrls = (figuresData.data || []).map((figure: any) => ({
      url: `${baseUrl}/figures/${figure.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Dynamic manga pages
    const mangaUrls = (mangaData.data || []).map((manga: any) => ({
      url: `${baseUrl}/manga/${manga.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Dynamic plushie pages
    const plushieUrls = (plushiesData.data || []).map((plushie: any) => ({
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
  } catch (error) {
    // Return just static pages if API fails
    return staticUrls
  }
}
