require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanupDuplicates() {
  const transactionId = 'b5344698-8f47-474f-8cf7-48f0e0031c20'
  
  console.log('🧹 Cleaning up duplicate orders...')
  console.log('---')
  
  // Get all orders with this payment_id
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_id', transactionId)
    .order('created_at', { ascending: true }) // Oldest first
  
  console.log('Found', orders?.length, 'orders with payment_id:', transactionId)
  
  if (!orders || orders.length <= 1) {
    console.log('✅ No duplicates to clean')
    return
  }
  
  // Keep the oldest one (first created)
  const keepOrder = orders[0]
  const deleteOrders = orders.slice(1)
  
  console.log('\n📌 KEEPING:')
  console.log('   Order:', keepOrder.order_number)
  console.log('   Created:', keepOrder.created_at)
  
  console.log('\n🗑️ DELETING:')
  for (const order of deleteOrders) {
    console.log('   Order:', order.order_number, '(Created:', order.created_at + ')')
    
    // Delete order items first
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', order.id)
    
    if (itemsError) {
      console.error('   ❌ Failed to delete items:', itemsError)
      continue
    }
    
    // Delete order
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', order.id)
    
    if (orderError) {
      console.error('   ❌ Failed to delete order:', orderError)
    } else {
      console.log('   ✅ Deleted')
    }
  }
  
  // Update transaction with user_id
  console.log('\n🔗 Updating transaction user_id...')
  const { data: customer } = await supabase
    .from('customers')
    .select('user_id')
    .eq('email', 'rekiseu@gmail.com')
    .single()
  
  if (customer?.user_id) {
    const { error: txnError } = await supabase
      .from('payment_transactions')
      .update({ user_id: customer.user_id })
      .eq('id', transactionId)
    
    if (txnError) {
      console.error('   ❌ Failed to update transaction:', txnError)
    } else {
      console.log('   ✅ Transaction user_id updated to:', customer.user_id)
    }
  }
  
  console.log('\n🎉 Cleanup complete!')
  console.log('✅ Keeping order:', keepOrder.order_number)
  console.log('View at: http://localhost:3000/orders')
}

cleanupDuplicates().catch(console.error)
