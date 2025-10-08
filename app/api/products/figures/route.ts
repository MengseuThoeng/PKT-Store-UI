import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/db/supabase'

export const dynamic = 'force-dynamic'

// GET /api/products/figures - Fetch all figures
export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    let query = supabase
      .from('figures')
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
        { error: 'Failed to fetch figures', details: error.message },
        { status: 500 }
      )
    }

    // Transform database format to match your Figure type
    const figures = data.map(item => ({
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
    }))

    return NextResponse.json({ 
      success: true,
      data: figures,
      count: figures.length
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
