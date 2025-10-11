import { Metadata } from 'next'
import { StructuredData, generateProductSchema } from "@/components/seo/structured-data"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const figureId = parseInt(resolvedParams.id)
  
  try {
    // Fetch figure from API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/products/figures`, {
      next: { revalidate: 3600 }
    })
    const result = await response.json()
    const figure = result.success ? result.data.find((f: any) => f.id === figureId) : null

    if (!figure) {
      return {
        title: 'Figure Not Found | PKT Store',
        description: 'The requested figure could not be found.'
      }
    }

    return {
      title: `${figure.name} - Premium Anime Figure`,
      description: `Buy ${figure.name} from ${figure.series || 'Anime'} series. Premium quality anime figure with authentic details. Price: $${figure.price}. Free shipping in Cambodia.`,
      keywords: [
        figure.name.toLowerCase(),
        figure.series?.toLowerCase() || 'anime',
        'anime figure',
        'collectible',
        'premium figure',
        `${figure.series?.toLowerCase() || 'anime'} figure`,
        'anime merchandise cambodia'
      ],
      openGraph: {
        title: `${figure.name} - Premium Anime Figure | PKT Store`,
        description: `Buy ${figure.name} from ${figure.series || 'Anime'} series. Premium quality anime figure with authentic details.`,
        images: [
          {
            url: figure.image,
            width: 600,
            height: 600,
            alt: `${figure.name} - ${figure.series || 'Anime'} Figure`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${figure.name} - Premium Anime Figure | PKT Store`,
        description: `Buy ${figure.name} from ${figure.series || 'Anime'} series. Premium quality anime figure with authentic details.`,
        images: [figure.image],
      },
    }
  } catch (error) {
    console.error('Error fetching figure metadata:', error)
    return {
      title: 'Figure Not Found | PKT Store',
      description: 'The requested figure could not be found.'
    }
  }
}
