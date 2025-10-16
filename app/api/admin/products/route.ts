import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/utils/auth';
import { createServerSupabaseClient } from '@/lib/db/supabase';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customer = session.session?.customers as any;
    if (!customer?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let allProducts: any[] = [];

    // Fetch figures
    if (!type || type === 'all' || type === 'figure') {
      const { data: figures } = await supabase
        .from('figures')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (figures) {
        allProducts = [...allProducts, ...figures.map(f => ({ 
          ...f, 
          type: 'figure',
          name: f.name || f.title, // Ensure name field exists
          image_url: f.image_url || f.image // Ensure image_url field exists
        }))];
      }
    }

    // Fetch manga
    if (!type || type === 'all' || type === 'manga') {
      const { data: manga } = await supabase
        .from('manga')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (manga) {
        allProducts = [...allProducts, ...manga.map(m => ({ 
          ...m, 
          type: 'manga',
          name: m.title || m.name, // Map title to name for consistency
          image_url: m.image || m.image_url // Map image to image_url
        }))];
      }
    }

    // Fetch plushies
    if (!type || type === 'all' || type === 'plushie') {
      const { data: plushies } = await supabase
        .from('plushies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (plushies) {
        allProducts = [...allProducts, ...plushies.map(p => ({ 
          ...p, 
          type: 'plushie',
          name: p.name || p.title, // Ensure name field exists
          image_url: p.image_url || p.image // Ensure image_url field exists
        }))];
      }
    }

    return NextResponse.json({
      success: true,
      products: allProducts,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customer = session.session?.customers as any;
    if (!customer?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const productData = await request.json();
    console.log('📦 Received product data:', productData);
    
    const { type, image_url, name, title, series, character, author, description, price, stock_count, is_featured } = productData;

    const supabase = createServerSupabaseClient();
    
    let table = '';
    let data: any = {};
    
    // Map fields to the correct columns based on product type
    if (type === 'figure') {
      table = 'figures';
      data = {
        name,
        series,
        character,
        description,
        price,
        stock_count,
        is_featured,
        image: image_url, // figures table uses 'image' column
      };
    } else if (type === 'manga') {
      table = 'manga';
      data = {
        title: title || name, // manga uses 'title' instead of 'name'
        author,
        description,
        price,
        stock_count,
        is_featured,
        image: image_url, // manga table uses 'image' column
      };
    } else if (type === 'plushie') {
      table = 'plushies';
      data = {
        name,
        description,
        price,
        stock_count,
        is_featured,
        image_url: image_url, // plushies table uses 'image_url' column
      };
    } else {
      return NextResponse.json({ error: 'Invalid product type' }, { status: 400 });
    }

    console.log('🗄️ Inserting into table:', table);
    console.log('📝 Data to insert:', data);

    const { data: newProduct, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create product', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Product created successfully',
    });
  } catch (error: any) {
    console.error('❌ Error in create product API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
