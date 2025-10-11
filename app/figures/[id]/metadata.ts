import { Metadata } from 'next'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params
  const figureId = parseInt(resolvedParams.id)
  
  try {
    // Fetch figure from API
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://pkt-store.vercel.app'
    const apiUrl = `${baseUrl}/api/products/figures`
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    const result = await response.json()
    const figure = result.success ? result.data.find((f: any) => f.id === figureId) : null

    if (!figure) {
      return {
        title: 'Figure Not Found | PKT Store',
        description: 'The requested figure could not be found.',
        robots: {
          index: false,
          follow: true
        }
      }
    }

    // Construct full image URL
    const imageUrl = figure.image_url?.startsWith('http') 
      ? figure.image_url 
      : `${baseUrl}${figure.image_url || figure.image || '/images/pkt.jpg'}`

    const productUrl = `${baseUrl}/figures/${figureId}`
    const price = figure.price?.toFixed(2) || '0.00'
    const inStock = figure.stock_count > 0

    return {
      title: `${figure.name} - Premium Anime Figure | PKT Store`,
      description: `${figure.description || `Buy ${figure.name} from ${figure.series || 'Anime'} series. Premium quality anime figure with authentic details. ${figure.scale || ''} scale, ${figure.height || ''} tall.`} Price: $${price}. ${inStock ? 'In Stock' : 'Out of Stock'}. Free shipping on orders over $50.`,
      keywords: [
        figure.name?.toLowerCase(),
        figure.series?.toLowerCase(),
        figure.character?.toLowerCase(),
        'anime figure',
        'collectible figure',
        'premium figure',
        'scale figure',
        `${figure.series?.toLowerCase()} figure`,
        `${figure.character?.toLowerCase()} figure`,
        'anime merchandise cambodia',
        'pkt store'
      ].filter(Boolean),
      authors: [{ name: 'PKT Store' }],
      creator: 'PKT Store',
      publisher: 'PKT Store',
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: productUrl,
      },
      openGraph: {
        type: 'website',
        url: productUrl,
        title: `${figure.name} - Premium ${figure.series || 'Anime'} Figure`,
        description: `${figure.description || `Premium quality ${figure.name} anime figure from ${figure.series || 'popular anime series'}. ${figure.scale || ''} scale with authentic details. Perfect for collectors!`}`,
        siteName: 'PKT Store',
        locale: 'en_US',
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 1000,
            alt: `${figure.name} - ${figure.series || 'Anime'} Figure`,
          },
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${figure.name} Figure`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${figure.name} - Premium Anime Figure | PKT Store`,
        description: `${figure.description || `Premium ${figure.name} figure from ${figure.series}. $${price}.`}`,
        images: [imageUrl],
        creator: '@PKTStore',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
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
