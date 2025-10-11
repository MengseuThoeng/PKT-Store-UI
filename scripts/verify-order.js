require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyOrder() {
  const transactionId = 'b5344698-8f47-474f-8cf7-48f0e0031c20'
  
  console.log('🔍 Verifying order for transaction:', transactionId)
  console.log('---')
  
  // Check transaction
  const { data: transaction } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('id', transactionId)
    .single()
  
  if (!transaction) {
    console.error('❌ Transaction not found')
    return
  }
  
  console.log('✅ Transaction Status:', transaction.status)
  console.log('   Amount:', transaction.amount)
  console.log('   Customer:', transaction.customer_name)
  console.log('')
  
  // Check order
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('payment_id', transactionId)
    .single()
  
  if (!order) {
    console.error('❌ No order found for this transaction')
    return
  }
  
  console.log('✅ ORDER FOUND!')
  console.log('---')
  console.log('Order Number:', order.order_number)
  console.log('Status:', order.status)
  console.log('Payment Status:', order.payment_status)
  console.log('Total:', '$' + order.total_amount)
  console.log('Created:', new Date(order.created_at).toLocaleString())
  console.log('')
  console.log('Items:')
  order.order_items.forEach(item => {
    console.log(`  - ${item.product_name} x ${item.quantity} = $${item.subtotal}`)
  })
  console.log('')
  console.log('🎉 Order successfully recovered and verified!')
  console.log('View at: http://localhost:3000/orders')
}

verifyOrder().catch(console.error)
