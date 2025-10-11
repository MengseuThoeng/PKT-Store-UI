import { Metadata } from 'next'
import MangaDetailClient from './client'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const mangaId = parseInt(resolvedParams.id)
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://pkt-store.vercel.app'
    const response = await fetch(`${baseUrl}/api/products/manga`, { next: { revalidate: 3600 } })
    const result = await response.json()
    const manga = result.success ? result.data.find((m: any) => m.id === mangaId) : null

    if (!manga) {
      return { title: 'Manga Not Found | PKT Store', description: 'The requested manga could not be found.' }
    }

    const imageUrl = manga.image_url?.startsWith('http') ? manga.image_url : `${baseUrl}${manga.image_url || manga.image || '/images/pkt.jpg'}`
    const productUrl = `${baseUrl}/manga/${mangaId}`
    const price = manga.price?.toFixed(2) || '0.00'

    return {
      title: `${manga.title} ${manga.volume ? `Vol. ${manga.volume}` : ''} - Manga | PKT Store`,
      description: `${manga.description || `Read ${manga.title} by ${manga.author || 'popular author'}`} Price: $${price}.`,
      metadataBase: new URL(baseUrl),
      alternates: { canonical: productUrl },
      openGraph: {
        type: 'website',
        url: productUrl,
        title: `${manga.title} - Manga`,
        description: `${manga.title} by ${manga.author || 'popular author'}`,
        siteName: 'PKT Store',
        images: [{ url: imageUrl, width: 1200, height: 630, alt: `${manga.title} Manga Cover` }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${manga.title} - Manga`,
        description: `${manga.title} by ${manga.author}. $${price}.`,
        images: [imageUrl],
      },
    }
  } catch (error) {
    return { title: 'Manga | PKT Store', description: 'Premium manga collection' }
  }
}

export default function MangaDetailPage() {
  return <MangaDetailClient />
}
