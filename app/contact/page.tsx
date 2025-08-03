import ContactUs from '@/components/customs/contactUs'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact PKT Store - Get in Touch with Our Anime Experts',
  description: 'Contact PKT Store for anime merchandise inquiries, order support, or product recommendations. Reach us via phone, email, or visit our store in Phnom Penh, Cambodia.',
  keywords: [
    'contact pkt store',
    'anime store contact',
    'customer service',
    'phnom penh anime store',
    'order support',
    'anime merchandise help',
    'contact cambodia anime store'
  ],
  openGraph: {
    title: 'Contact PKT Store - Get in Touch with Our Anime Experts',
    description: 'Contact PKT Store for anime merchandise inquiries, order support, or product recommendations. We\'re here to help with all your anime needs.',
    images: [
      {
        url: '/images/contact-pkt-store.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact PKT Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact PKT Store - Get in Touch with Our Anime Experts',
    description: 'Contact PKT Store for anime merchandise inquiries, order support, or product recommendations.',
    images: ['/images/contact-pkt-store-twitter.jpg'],
  },
}

const page = () => {
  return (
    <div>
        <ContactUs />
    </div>
  )
}

export default page