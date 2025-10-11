import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/utils/auth';
import { createServerSupabaseClient } from '@/lib/db/supabase';

export async function GET() {
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

    // Get total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Get total revenue
    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid');

    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    // Get total customers
    const { count: totalCustomers } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    // Get total products (figures + manga + plushies)
    const { count: figuresCount } = await supabase
      .from('figures')
      .select('*', { count: 'exact', head: true });
    
    const { count: mangaCount } = await supabase
      .from('manga')
      .select('*', { count: 'exact', head: true });
    
    const { count: plushiesCount } = await supabase
      .from('plushies')
      .select('*', { count: 'exact', head: true });

    const totalProducts = (figuresCount || 0) + (mangaCount || 0) + (plushiesCount || 0);

    // Get order status counts
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: processingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'processing');

    const { count: deliveredOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'delivered');

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: totalOrders || 0,
        totalRevenue,
        totalCustomers: totalCustomers || 0,
        totalProducts,
        pendingOrders: pendingOrders || 0,
        processingOrders: processingOrders || 0,
        deliveredOrders: deliveredOrders || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
