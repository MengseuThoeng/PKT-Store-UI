import MangaListPage from '@/components/list/mangaList'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manga Collection - Japanese Comics & Light Novels',
  description: 'Explore our extensive manga collection featuring One Piece, Naruto, Attack on Titan, Dragon Ball, and more popular series. Original Japanese comics with English translations.',
  keywords: [
    'manga',
    'japanese comics',
    'one piece manga',
    'naruto manga',
    'attack on titan manga',
    'dragon ball manga',
    'anime comics cambodia',
    'manga collection',
    'light novels'
  ],
  openGraph: {
    title: 'Manga Collection - Japanese Comics & Light Novels | PKT Store',
    description: 'Explore our extensive manga collection featuring One Piece, Naruto, Attack on Titan, Dragon Ball, and more popular series.',
    images: [
      {
        url: '/images/manga-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Manga Collection - Japanese Comics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manga Collection - Japanese Comics & Light Novels | PKT Store',
    description: 'Explore our extensive manga collection featuring One Piece, Naruto, Attack on Titan, Dragon Ball, and more.',
    images: ['/images/manga-collection-twitter.jpg'],
  },
}

const page = () => {
  return (
    <div>
      <MangaListPage />
    </div>
  )
}

export default page
