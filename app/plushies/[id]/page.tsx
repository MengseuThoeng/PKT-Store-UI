import { Metadata } from 'next'
import PlushieDetailClient from './client'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const plushieId = parseInt(resolvedParams.id)
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://pkt-store.vercel.app'
    const response = await fetch(`${baseUrl}/api/products/plushies`, { next: { revalidate: 3600 } })
    const result = await response.json()
    const plushie = result.success ? result.data.find((p: any) => p.id === plushieId) : null

    if (!plushie) {
      return { title: 'Plushie Not Found | PKT Store', description: 'The requested plushie could not be found.' }
    }

    const imageUrl = plushie.image_url?.startsWith('http') ? plushie.image_url : `${baseUrl}${plushie.image_url || plushie.image || '/images/pkt.jpg'}`
    const productUrl = `${baseUrl}/plushies/${plushieId}`
    const price = plushie.price?.toFixed(2) || '0.00'

    return {
      title: `${plushie.name} - Adorable Plushie | PKT Store`,
      description: `${plushie.description || `Buy ${plushie.name} - Premium plushie from ${plushie.series || 'anime'}`} Price: $${price}.`,
      metadataBase: new URL(baseUrl),
      alternates: { canonical: productUrl },
      openGraph: {
        type: 'website',
        url: productUrl,
        title: `${plushie.name} - Adorable Plushie`,
        description: `Premium ${plushie.name} plushie`,
        siteName: 'PKT Store',
        images: [{ url: imageUrl, width: 1200, height: 630, alt: `${plushie.name} Plushie` }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${plushie.name} - Plushie`,
        description: `Premium ${plushie.name} plushie. $${price}.`,
        images: [imageUrl],
      },
    }
  } catch (error) {
    return { title: 'Plushie | PKT Store', description: 'Premium anime plushies' }
  }
}

export default function PlushieDetailPage() {
  return <PlushieDetailClient />
}
