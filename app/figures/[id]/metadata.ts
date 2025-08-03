import { Metadata } from 'next'
import { featuredProducts } from "@/lib/data/figure-data"
import { StructuredData, generateProductSchema } from "@/components/seo/structured-data"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const figureId = parseInt(resolvedParams.id)
  const figure = featuredProducts.find(f => f.id === figureId)

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
}
