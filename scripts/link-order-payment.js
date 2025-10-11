require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function linkOrderToTransaction() {
  const transactionId = 'b5344698-8f47-474f-8cf7-48f0e0031c20'
  const orderNumber = 'ORD-1760065518541'
  
  console.log('🔗 Linking order to transaction...')
  console.log('Transaction:', transactionId)
  console.log('Order:', orderNumber)
  console.log('---')
  
  // Update order with payment_id
  const { data: order, error } = await supabase
    .from('orders')
    .update({ payment_id: transactionId })
    .eq('order_number', orderNumber)
    .select()
    .single()
  
  if (error) {
    console.error('❌ Failed to link:', error)
    return
  }
  
  console.log('✅ Order linked successfully!')
  console.log('Order ID:', order.id)
  console.log('Payment ID:', order.payment_id)
  console.log('')
  console.log('🎉 Complete! Order is now properly linked to the payment.')
}

linkOrderToTransaction().catch(console.error)
