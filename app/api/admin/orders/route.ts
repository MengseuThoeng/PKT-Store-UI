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
    const status = searchParams.get('status');

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        *,
        customers:customer_id (
          id,
          name,
          email,
          phone
        ),
        order_items (
          id,
          product_type,
          product_name,
          quantity,
          price
        )
      `)
      .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Format the response
    const formattedOrders = orders?.map(order => ({
      ...order,
      customer: Array.isArray(order.customers) ? order.customers[0] : order.customers,
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders || [],
    });
  } catch (error: any) {
    console.error('Error in admin orders API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
