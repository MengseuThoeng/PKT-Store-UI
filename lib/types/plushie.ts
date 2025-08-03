export type Plushie = {
  id: number
  name: string
  price: number
  image: string
  originalPrice?: number
  rating?: number
  isNew?: boolean
  size: string
  character: string
  series: string
  material?: string
  description?: string
  manufacturer?: string
  releaseDate?: string
  dimensions?: string
  weight?: string
  careInstructions?: string
  ageRange?: string
  inStock?: boolean
  stockCount?: number
  images?: string[]
  features?: string[]
  category?: string
  tags?: string[]
}
