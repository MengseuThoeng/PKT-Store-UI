import FiguresPage from '@/components/list/figuresList'
import React from 'react'
import type { Metadata } from 'next'
import { StructuredData } from '@/components/seo/structured-data'
import { figuresBreadcrumb } from '@/components/seo/breadcrumb-schema'

export const metadata: Metadata = {
  title: 'Premium Anime Figures Collection',
  description: 'Discover premium anime figures from popular series like One Piece, Naruto, Attack on Titan, and more. Authentic collectibles with free shipping in Cambodia.',
  keywords: [
    'anime figures',
    'one piece figures',
    'naruto figures',
    'attack on titan figures',
    'premium collectibles',
    'anime merchandise cambodia',
    'luffy figure',
    'goku figure',
    'collectible figures'
  ],
  openGraph: {
    title: 'Premium Anime Figures Collection | PKT Store',
    description: 'Discover premium anime figures from popular series like One Piece, Naruto, Attack on Titan, and more.',
    images: [
      {
        url: '/images/figures-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Anime Figures Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Anime Figures Collection | PKT Store',
    description: 'Discover premium anime figures from popular series like One Piece, Naruto, Attack on Titan, and more.',
    images: ['/images/figures-collection-twitter.jpg'],
  },
}

const page = () => {
  return (
    <div>
      <StructuredData data={figuresBreadcrumb} />
      <FiguresPage />
    </div>
  )
}

export default page