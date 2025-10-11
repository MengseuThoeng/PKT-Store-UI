import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/utils/auth';
import { createServerSupabaseClient } from '@/lib/db/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
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

    const { orderId } = await params;
    const supabase = createServerSupabaseClient();

    // Get order with customer info and items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        customers:customer_id (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch order items' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: items || []
      }
    });
  } catch (error: any) {
    console.error('Error in get order details API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
