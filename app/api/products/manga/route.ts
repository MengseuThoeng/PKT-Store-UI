import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/db/supabase'

export const dynamic = 'force-dynamic'

// GET /api/products/manga - Fetch all manga
export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    let query = supabase
      .from('manga')
      .select('*')
      .order('created_at', { ascending: false })

    // Filter by featured if requested
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Limit results if specified
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch manga', details: error.message },
        { status: 500 }
      )
    }

    // Transform database format to match your Manga type
    const manga = data.map(item => ({
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
    }))

    return NextResponse.json({ 
      success: true,
      data: manga,
      count: manga.length
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
