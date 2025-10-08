// API client functions for fetching products

const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

interface FetchOptions {
  featured?: boolean
  limit?: number
}

/**
 * Fetch all figures from the database
 */
export async function fetchFigures(options: FetchOptions = {}) {
  try {
    const params = new URLSearchParams()
    if (options.featured) params.append('featured', 'true')
    if (options.limit) params.append('limit', options.limit.toString())

    const url = `${API_BASE_URL}/api/products/figures${params.toString() ? `?${params}` : ''}`
    const response = await fetch(url, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error('Failed to fetch figures')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching figures:', error)
    return []
  }
}

/**
 * Fetch all manga from the database
 */
export async function fetchManga(options: FetchOptions = {}) {
  try {
    const params = new URLSearchParams()
    if (options.featured) params.append('featured', 'true')
    if (options.limit) params.append('limit', options.limit.toString())

    const url = `${API_BASE_URL}/api/products/manga${params.toString() ? `?${params}` : ''}`
    const response = await fetch(url, {
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch manga')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching manga:', error)
    return []
  }
}

/**
 * Fetch all plushies from the database
 */
export async function fetchPlushies(options: FetchOptions = {}) {
  try {
    const params = new URLSearchParams()
    if (options.featured) params.append('featured', 'true')
    if (options.limit) params.append('limit', options.limit.toString())

    const url = `${API_BASE_URL}/api/products/plushies${params.toString() ? `?${params}` : ''}`
    const response = await fetch(url, {
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch plushies')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching plushies:', error)
    return []
  }
}

/**
 * Fetch all products (figures + manga + plushies)
 */
export async function fetchAllProducts(options: FetchOptions & { type?: 'all' | 'figure' | 'manga' | 'plushie' } = {}) {
  try {
    const params = new URLSearchParams()
    if (options.type) params.append('type', options.type)
    if (options.featured) params.append('featured', 'true')
    if (options.limit) params.append('limit', options.limit.toString())

    const url = `${API_BASE_URL}/api/products${params.toString() ? `?${params}` : ''}`
    const response = await fetch(url, {
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

/**
 * Fetch a single product by ID and type
 */
export async function fetchProductById(id: number, type: 'figure' | 'manga' | 'plushie') {
  try {
    const url = `${API_BASE_URL}/api/products/${type}s?id=${id}`
    const response = await fetch(url, {
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type}`)
    }

    const result = await response.json()
    return result.data?.[0] || null
  } catch (error) {
    console.error(`Error fetching ${type}:`, error)
    return null
  }
}
