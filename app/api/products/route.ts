import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/db/supabase'

export const dynamic = 'force-dynamic'

// GET /api/products - Fetch all products (figures + manga + plushies)
export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'figure', 'manga', 'plushie', or 'all'
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    const results: any[] = []

    // Fetch based on type
    if (!type || type === 'all' || type === 'figure') {
      let figureQuery = supabase
        .from('figures')
        .select('*')
        .order('created_at', { ascending: false })

      if (featured === 'true') {
        figureQuery = figureQuery.eq('is_featured', true)
      }

      const { data: figures, error: figureError } = await figureQuery

      if (!figureError && figures) {
        results.push(...figures.map(item => ({
          id: item.id,
          name: item.name,
          series: item.series,
          character: item.character,
          price: parseFloat(item.price),
          originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
          image: item.image,
          stockCount: item.stock_count,
          rating: parseFloat(item.rating || '0'),
          isNew: item.is_new,
          category: 'figure' as const
        })))
      }
    }

    if (!type || type === 'all' || type === 'manga') {
      let mangaQuery = supabase
        .from('manga')
        .select('*')
        .order('created_at', { ascending: false })

      if (featured === 'true') {
        mangaQuery = mangaQuery.eq('is_featured', true)
      }

      const { data: manga, error: mangaError } = await mangaQuery

      if (!mangaError && manga) {
        results.push(...manga.map(item => ({
          id: item.id,
          title: item.title,
          author: item.author,
          price: parseFloat(item.price),
          originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
          image: item.image,
          stockCount: item.stock_count,
          rating: parseFloat(item.rating || '0'),
          volumes: item.volume || 1,
          genre: item.genre || [],
          status: item.status,
          category: 'manga' as const
        })))
      }
    }

    if (!type || type === 'all' || type === 'plushie') {
      let plushieQuery = supabase
        .from('plushies')
        .select('*')
        .order('created_at', { ascending: false })

      if (featured === 'true') {
        plushieQuery = plushieQuery.eq('is_featured', true)
      }

      const { data: plushies, error: plushieError } = await plushieQuery

      if (!plushieError && plushies) {
        results.push(...plushies.map(item => ({
          id: item.id,
          name: item.name,
          character: item.character,
          series: item.series,
          price: parseFloat(item.price),
          originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
          image: item.image,
          stockCount: item.stock_count,
          rating: parseFloat(item.rating || '0'),
          size: item.size,
          material: item.material,
          isNew: item.is_new,
          category: 'plushie' as const
        })))
      }
    }

    // Apply limit if specified
    const finalResults = limit ? results.slice(0, parseInt(limit)) : results

    return NextResponse.json({ 
      success: true,
      data: finalResults,
      count: finalResults.length
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
