import { BreadcrumbList } from 'schema-dts'

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }
}

// Category breadcrumbs
export const figuresBreadcrumb = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://pkt-store.vercel.app' },
  { name: 'Figures', url: 'https://pkt-store.vercel.app/figures' }
])

export const mangaBreadcrumb = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://pkt-store.vercel.app' },
  { name: 'Manga', url: 'https://pkt-store.vercel.app/manga' }
])

export const plushiesBreadcrumb = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://pkt-store.vercel.app' },
  { name: 'Plushies', url: 'https://pkt-store.vercel.app/plushies' }
])

export function generateProductBreadcrumb(category: string, categoryUrl: string, productName: string, productUrl: string) {
  return generateBreadcrumbSchema([
    { name: 'Home', url: 'https://pkt-store.vercel.app' },
    { name: category, url: categoryUrl },
    { name: productName, url: productUrl }
  ])
}
