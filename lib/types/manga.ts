export type Manga = {
  id: number
  title: string
  author: string
  price: number
  originalPrice?: number
  image: string
  rating?: number
  volumes: number
  status: "ongoing" | "completed" | "new"
  genre: string[]
  isPopular?: boolean
  description: string
  publisher?: string
  publishDate?: string
  language?: string
  dimensions?: string
  pages?: number
  isbn?: string
  inStock?: boolean
  stockCount?: number
  images?: string[]
  features?: string[]
  demographics?: string
  serialization?: string
}