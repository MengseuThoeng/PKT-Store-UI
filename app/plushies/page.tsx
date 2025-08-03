import PlushiePage from '@/components/list/plushiesList'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cute Anime Plushies & Soft Toys Collection',
  description: 'Adorable anime plushies and soft toys from Pokemon, Studio Ghibli, and popular anime series. Perfect for gifts and collectors. Soft, cuddly, and authentic.',
  keywords: [
    'anime plushies',
    'pokemon plushies',
    'totoro plushie',
    'pikachu plushie',
    'anime soft toys',
    'cute plushies',
    'anime gifts cambodia',
    'collectible plushies',
    'studio ghibli plushies'
  ],
  openGraph: {
    title: 'Cute Anime Plushies & Soft Toys Collection | PKT Store',
    description: 'Adorable anime plushies and soft toys from Pokemon, Studio Ghibli, and popular anime series. Perfect for gifts and collectors.',
    images: [
      {
        url: '/images/plushies-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Cute Anime Plushies Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cute Anime Plushies & Soft Toys Collection | PKT Store',
    description: 'Adorable anime plushies and soft toys from Pokemon, Studio Ghibli, and popular anime series.',
    images: ['/images/plushies-collection-twitter.jpg'],
  },
}

const page = () => {
  return (
    <div>
      <PlushiePage />
    </div>
  )
}

export default page