require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixTransaction() {
  const transactionId = 'b5344698-8f47-474f-8cf7-48f0e0031c20' // Update this
  const customerEmail = 'rekiseu@gmail.com'
  
  console.log('🔧 Fixing transaction:', transactionId)
  console.log('---')
  
  // Get transaction
  const { data: transaction } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('id', transactionId)
    .single()
  
  if (!transaction) {
    console.error('❌ Transaction not found')
    return
  }
  
  console.log('✅ Transaction found')
  console.log('  Customer Email:', transaction.customer_email)
  console.log('')
  
  // Find customer by email
  console.log('🔍 Looking for customer by email...')
  const { data: customer, error: custError } = await supabase
    .from('customers')
    .select('*')
    .eq('email', customerEmail)
    .single()
  
  if (custError || !customer) {
    console.error('❌ Customer not found:', custError)
    console.log('')
    console.log('💡 Creating customer record...')
    
    // Create customer
    const { data: newCustomer, error: createError } = await supabase
      .from('customers')
      .insert({
        name: transaction.customer_name,
        email: transaction.customer_email,
        phone: transaction.customer_phone,
        address: 'N/A',
      })
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Failed to create customer:', createError)
      return
    }
    
    console.log('✅ Customer created:', newCustomer.id)
    console.log('')
    
    // Create order with new customer
    await createOrder(transaction, newCustomer.id)
  } else {
    console.log('✅ Customer found:', customer.id)
    console.log('  Name:', customer.name)
    console.log('  User ID:', customer.user_id || '❌ NULL')
    console.log('')
    
    // Create order
    await createOrder(transaction, customer.id)
  }
}

async function createOrder(transaction, customerId) {
  console.log('📦 Creating order...')
  
  const metadata = transaction.metadata || {}
  const items = metadata.items || []
  
  const orderNumber = `ORD-${Date.now()}`
  const subtotal = parseFloat(transaction.amount)
  const totalAmount = subtotal
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_id: customerId,
      customer_name: transaction.customer_name,
      customer_email: transaction.customer_email,
      customer_phone: transaction.customer_phone || '',
      customer_address: 'N/A',
      total_amount: totalAmount,
      subtotal: subtotal,
      shipping_fee: 0,
      discount: 0,
      status: 'confirmed',
      payment_method: transaction.payment_method,
      payment_status: 'paid',
      payment_id: transaction.id,
      telegram_sent: false,
    })
    .select()
    .single()
  
  if (orderError) {
    console.error('❌ Failed to create order:', orderError)
    return
  }
  
  console.log('✅ Order created:', order.order_number)
  console.log('  Order ID:', order.id)
  console.log('  Total:', order.total_amount)
  console.log('')
  
  // Create order items
  if (items.length > 0) {
    console.log('📦 Creating order items...')
    
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: parseInt(item.id) || 0,
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
      console.error('❌ Failed to create order items:', itemsError)
    } else {
      console.log('✅ Order items created:', orderItems.length, 'items')
      orderItems.forEach(item => {
        console.log('  -', item.product_name, 'x', item.quantity, '=', item.subtotal)
      })
    }
  }
  
  console.log('')
  console.log('🎉 ORDER RECOVERY COMPLETE!')
  console.log('Order Number:', order.order_number)
  console.log('You can view it at: /orders')
}

fixTransaction().catch(console.error)
