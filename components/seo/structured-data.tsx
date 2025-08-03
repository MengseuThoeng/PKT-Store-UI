import { Organization, Product, Store, WebSite, BreadcrumbList } from 'schema-dts'

interface StructuredDataProps {
  data: Organization | Product | Store | WebSite | BreadcrumbList
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization Schema for PKT Store
export const organizationSchema: Organization = {
  '@type': 'Organization',
  '@id': 'https://pkt-store.vercel.app/#organization',
  name: 'PKT Store',
  url: 'https://pkt-store.vercel.app',
  logo: 'https://pkt-store.vercel.app/images/pkt-logo.png',
  description: 'Premium anime figures, manga collections, and plushies store in Cambodia',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KH',
    addressLocality: 'Phnom Penh',
    addressRegion: 'Phnom Penh'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'Khmer']
  },
  sameAs: [
    'https://t.me/PKTStore', // Replace with your social media
    // Add more social media links
  ]
}

// Website Schema
export const websiteSchema: WebSite = {
  '@type': 'WebSite',
  '@id': 'https://pkt-store.vercel.app/#website',
  url: 'https://pkt-store.vercel.app',
  name: 'PKT Store',
  description: 'Premium anime figures, manga collections, and plushies store in Cambodia',
  publisher: {
    '@id': 'https://pkt-store.vercel.app/#organization'
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://pkt-store.vercel.app/search?q={search_term_string}'
    }
  }
}

// Store Schema
export const storeSchema: Store = {
  '@type': 'Store',
  '@id': 'https://pkt-store.vercel.app/#store',
  name: 'PKT Store',
  description: 'Premium anime figures, manga collections, and plushies store in Cambodia',
  url: 'https://pkt-store.vercel.app',
  image: 'https://pkt-store.vercel.app/images/pkt-store.jpg',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KH',
    addressLocality: 'Phnom Penh',
    addressRegion: 'Phnom Penh'
  },
  paymentAccepted: ['ABA Bank', 'ACLEDA Bank', 'Wing', 'Cash on Delivery'],
  currenciesAccepted: 'USD',
  openingHours: 'Mo-Su 09:00-20:00'
}

// Product Schema Generator
export function generateProductSchema(product: {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  brand?: string
  series?: string
}): Product {
  return {
    '@type': 'Product',
    '@id': `https://pkt-store.vercel.app/products/${product.id}`,
    name: product.name,
    description: product.description,
    image: product.image,
    brand: product.brand || 'Various',
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@id': 'https://pkt-store.vercel.app/#organization'
      }
    },
    additionalProperty: product.series ? {
      '@type': 'PropertyValue',
      name: 'Series',
      value: product.series
    } : undefined
  }
}
