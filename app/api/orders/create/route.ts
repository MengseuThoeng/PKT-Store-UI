import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/db/supabase'

/**
 * POST /api/orders/create
 * Create order from successful payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId } = body

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Get completed payment transaction
    const { data: transaction, error: txError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('status', 'completed')
      .single()

    if (txError || !transaction) {
      return NextResponse.json(
        { error: 'Payment transaction not found or not completed' },
        { status: 404 }
      )
    }

    // Check if order already exists for this transaction
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id, order_number')
      .eq('payment_id', transaction.id)
      .maybeSingle()

    if (existingOrder) {
      console.log('✅ Order already exists:', existingOrder.order_number)
      return NextResponse.json({
        success: true,
        order: existingOrder,
        message: 'Order already exists',
      })
    }

    // Get user/customer info from transaction
    const metadata = transaction.metadata as any || {}
    const items = metadata.items || []

    // Get customer_id from transaction's user_id (always present since login required)
    if (!transaction.user_id) {
      return NextResponse.json(
        { error: 'Invalid transaction: user not found' },
        { status: 400 }
      )
    }

    // Find customer record by user_id
    let { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', transaction.user_id)
      .maybeSingle()
    
    // If customer not found, create one automatically
    if (!customer) {
      console.log('📝 Customer record not found, creating one for user_id:', transaction.user_id)
      
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          user_id: transaction.user_id,
          name: transaction.customer_name,
          email: transaction.customer_email,
          phone: transaction.customer_phone || '',
          address: metadata.customer_address || 'N/A',
        })
        .select('id')
        .single()
      
      if (createError || !newCustomer) {
        console.error('❌ Failed to create customer:', createError)
        return NextResponse.json(
          { error: 'Failed to create customer record' },
          { status: 500 }
        )
      }
      
      customer = newCustomer
      console.log('✅ Customer created:', customer.id)
    }

    const customerId = customer.id
    console.log('✅ Found/Created customer_id:', customerId, 'for user_id:', transaction.user_id)

    // Calculate totals
    const subtotal = parseFloat(transaction.amount)
    const shippingFee = 0 // You can add shipping logic here
    const discount = 0
    const totalAmount = subtotal + shippingFee - discount

    // Create order - Only for completed payments
    const orderNumber = `ORD-${Date.now()}`
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        customer_name: transaction.customer_name,
        customer_email: transaction.customer_email,
        customer_phone: transaction.customer_phone || '',
        customer_address: metadata.customer_address || 'N/A',
        total_amount: totalAmount,
        subtotal: subtotal,
        shipping_fee: shippingFee,
        discount: discount,
        status: 'pending',  // Start with 'pending'
        payment_method: transaction.payment_method,
        payment_status: 'paid',  // Only create order if paid
        payment_id: transaction.id,
        telegram_sent: false,
      })
      .select()
      .single()

    if (orderError) {
      console.error('❌ Failed to create order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create order items
    if (items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: parseInt(item.id) || 0,  // Convert to integer, default to 0 if null
        product_type: item.type || 'product',
        product_name: item.name || item.title || 'Product',
        product_image: item.image || '',
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price) || 0,
        subtotal: parseFloat(item.price) * (parseInt(item.quantity) || 1),
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('⚠️ Failed to create order items:', itemsError)
        // Don't fail the whole request
      } else {
        console.log('✅ Order items created:', orderItems.length)
      }
    }

    console.log('✅ Order created successfully:', orderNumber)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
      },
    })
  } catch (error) {
    console.error('❌ Create Order Error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
