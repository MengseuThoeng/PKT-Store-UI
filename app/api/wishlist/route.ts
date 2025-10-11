import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/utils/auth';
import { createServerSupabaseClient } from '@/lib/db/supabase';

// GET - Fetch user's wishlist
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session.success || !session.session?.user_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    
    const { data: wishlistItems, error } = await supabase
      .from('wishlists')
      .select('*')
      .eq('user_id', session.session.user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wishlist:', error);
      return NextResponse.json(
        { error: 'Failed to fetch wishlist' },
        { status: 500 }
      );
    }

    // Fetch product details for each wishlist item
    const itemsWithDetails = await Promise.all(
      (wishlistItems || []).map(async (item) => {
        const tableName = item.product_type === 'plushie' ? 'plushies' : 
                         item.product_type === 'manga' ? 'manga' : 'figures';
        
        const { data: product } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', item.product_id)
          .single();

        return {
          ...item,
          product: product || null
        };
      })
    );

    return NextResponse.json({
      success: true,
      items: itemsWithDetails,
      count: itemsWithDetails.length
    });

  } catch (error: any) {
    console.error('Error in wishlist GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session.success || !session.session?.user_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { product_id, product_type } = body;

    if (!product_id || !product_type) {
      return NextResponse.json(
        { error: 'Product ID and type are required' },
        { status: 400 }
      );
    }

    if (!['plushie', 'manga', 'figure'].includes(product_type)) {
      return NextResponse.json(
        { error: 'Invalid product type' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Check if already in wishlist
    const { data: existing } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', session.session.user_id)
      .eq('product_id', product_id)
      .eq('product_type', product_type)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Item already in wishlist',
        item: existing
      });
    }

    // Add to wishlist
    const { data: newItem, error } = await supabase
      .from('wishlists')
      .insert({
        user_id: session.session.user_id,
        product_id,
        product_type
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding to wishlist:', error);
      return NextResponse.json(
        { error: 'Failed to add to wishlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Added to wishlist',
      item: newItem
    });

  } catch (error: any) {
    console.error('Error in wishlist POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session.success || !session.session?.user_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { product_id, product_type } = body;

    if (!product_id || !product_type) {
      return NextResponse.json(
        { error: 'Product ID and type are required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', session.session.user_id)
      .eq('product_id', product_id)
      .eq('product_type', product_type);

    if (error) {
      console.error('Error removing from wishlist:', error);
      return NextResponse.json(
        { error: 'Failed to remove from wishlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist'
    });

  } catch (error: any) {
    console.error('Error in wishlist DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
