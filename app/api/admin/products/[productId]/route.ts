import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/utils/auth';
import { createServerSupabaseClient } from '@/lib/db/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const { productId } = await params;

    if (!type) {
      return NextResponse.json({ error: 'Product type required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    let table = '';
    
    if (type === 'figure') table = 'figures';
    else if (type === 'manga') table = 'manga';
    else if (type === 'plushie') table = 'plushies';
    else {
      return NextResponse.json({ error: 'Invalid product type' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product: { ...data, type },
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
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
    const { type, image_url, name, ...restData } = productData;
    const { productId } = await params;

    if (!type) {
      return NextResponse.json({ error: 'Product type required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    let table = '';
    let updateData: any = {};
    
    if (type === 'figure') {
      table = 'figures';
      updateData = {
        name,
        image: image_url,
        ...restData,
      };
    } else if (type === 'manga') {
      table = 'manga';
      updateData = {
        title: name,
        image: image_url,
        ...restData,
      };
    } else if (type === 'plushie') {
      table = 'plushies';
      updateData = {
        name,
        image_url,
        ...restData,
      };
    } else {
      return NextResponse.json({ error: 'Invalid product type' }, { status: 400 });
    }

    const { data: updatedProduct, error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('Error in update product API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const { productId } = await params;

    if (!type) {
      return NextResponse.json({ error: 'Product type required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    let table = '';
    
    if (type === 'figure') table = 'figures';
    else if (type === 'manga') table = 'manga';
    else if (type === 'plushie') table = 'plushies';
    else {
      return NextResponse.json({ error: 'Invalid product type' }, { status: 400 });
    }

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error in delete product API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
