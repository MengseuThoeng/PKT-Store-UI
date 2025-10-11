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

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'month';

    const supabase = createServerSupabaseClient();

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Fetch orders data
    const { data: allOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at');

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    // Fetch products data
    const [figuresRes, mangaRes, plushiesRes] = await Promise.all([
      supabase.from('figures').select('id, price'),
      supabase.from('manga').select('id, price'),
      supabase.from('plushies').select('id, price')
    ]);

    const figures = figuresRes.data || [];
    const manga = mangaRes.data || [];
    const plushies = plushiesRes.data || [];

    // Fetch customers data
    const { data: allCustomers, error: customersError } = await supabase
      .from('customers')
      .select('id, created_at, is_verified');

    if (customersError) {
      console.error('Error fetching customers:', customersError);
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }

    // Calculate revenue metrics
    const rangeOrders = allOrders.filter(order => 
      new Date(order.created_at) >= startDate
    );
    
    const totalRevenue = allOrders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
    const rangeRevenue = rangeOrders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
    
    // Calculate today's revenue
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRevenue = allOrders
      .filter(order => new Date(order.created_at) >= todayStart)
      .reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);

    // Calculate this week's revenue
    const weekStart = new Date();
    weekStart.setDate(now.getDate() - 7);
    const weekRevenue = allOrders
      .filter(order => new Date(order.created_at) >= weekStart)
      .reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);

    // Calculate this month's revenue
    const monthStart = new Date();
    monthStart.setMonth(now.getMonth() - 1);
    const monthRevenue = allOrders
      .filter(order => new Date(order.created_at) >= monthStart)
      .reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);

    // Calculate previous period for growth
    const previousStartDate = new Date(startDate);
    const timeDiff = now.getTime() - startDate.getTime();
    previousStartDate.setTime(startDate.getTime() - timeDiff);
    
    const previousOrders = allOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= previousStartDate && orderDate < startDate;
    });
    
    const previousRevenue = previousOrders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
    const revenueGrowth = previousRevenue > 0 
      ? ((rangeRevenue - previousRevenue) / previousRevenue) * 100 
      : 100;

    // Calculate order metrics
    const ordersByStatus = {
      pending: allOrders.filter(o => o.status === 'pending').length,
      processing: allOrders.filter(o => o.status === 'processing').length,
      delivered: allOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
    };

    const previousOrderCount = previousOrders.length;
    const orderGrowth = previousOrderCount > 0
      ? ((rangeOrders.length - previousOrderCount) / previousOrderCount) * 100
      : 100;

    // Calculate customer metrics
    const newCustomers = allCustomers.filter(c => 
      new Date(c.created_at) >= startDate
    ).length;

    const activeCustomers = allCustomers.filter(c => c.is_verified).length;

    const analytics = {
      revenue: {
        total: Math.round(totalRevenue * 100) / 100,
        today: Math.round(todayRevenue * 100) / 100,
        thisWeek: Math.round(weekRevenue * 100) / 100,
        thisMonth: Math.round(monthRevenue * 100) / 100,
        growth: Math.round(revenueGrowth * 10) / 10,
      },
      orders: {
        total: allOrders.length,
        pending: ordersByStatus.pending,
        processing: ordersByStatus.processing,
        delivered: ordersByStatus.delivered,
        growth: Math.round(orderGrowth * 10) / 10,
      },
      products: {
        total: figures.length + manga.length + plushies.length,
        figures: figures.length,
        manga: manga.length,
        plushies: plushies.length,
      },
      customers: {
        total: allCustomers.length,
        new: newCustomers,
        active: activeCustomers,
      },
    };

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
