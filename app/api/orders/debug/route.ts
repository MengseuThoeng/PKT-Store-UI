import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/db/supabase'

/**
 * GET /api/orders/debug
 * Debug endpoint to see all orders in database
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Get all orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, order_number, customer_id, customer_name, customer_email, total_amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get all payment transactions
    const { data: transactions } = await supabase
      .from('payment_transactions')
      .select('id, transaction_id, user_id, customer_name, customer_email, amount, status, created_at')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(20)

    // Get all customers
    const { data: customers } = await supabase
      .from('customers')
      .select('id, user_id, name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(20)

    return NextResponse.json({
      success: true,
      summary: {
        total_orders: orders?.length || 0,
        orders_with_customer_id: orders?.filter(o => o.customer_id !== null).length || 0,
        orders_without_customer_id: orders?.filter(o => o.customer_id === null).length || 0,
        completed_transactions: transactions?.length || 0,
        total_customers: customers?.length || 0,
      },
      orders: orders || [],
      transactions: transactions || [],
      customers: customers || [],
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
