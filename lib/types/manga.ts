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
}