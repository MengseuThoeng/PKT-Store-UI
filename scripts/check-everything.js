require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkEverything() {
  const transactionId = 'b5344698-8f47-474f-8cf7-48f0e0031c20'
  const orderNumber = 'ORD-1760065518541'
  
  console.log('🔍 Complete Status Check')
  console.log('='.repeat(50))
  
  // 1. Check Transaction
  console.log('\n1️⃣ TRANSACTION:')
  const { data: txn } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('id', transactionId)
    .single()
  
  console.log('   ID:', txn?.id)
  console.log('   Status:', txn?.status)
  console.log('   Amount:', txn?.amount)
  console.log('   Customer:', txn?.customer_name)
  console.log('   User ID:', txn?.user_id)
  
  // 2. Check Order by order_number
  console.log('\n2️⃣ ORDER (by order_number):')
  const { data: order1 } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single()
  
  console.log('   Order Number:', order1?.order_number)
  console.log('   Order ID:', order1?.id)
  console.log('   Payment ID:', order1?.payment_id)
  console.log('   Status:', order1?.status)
  console.log('   Total:', order1?.total_amount)
  
  // 3. Check Order by payment_id
  console.log('\n3️⃣ ORDER (by payment_id):')
  const { data: order2, error: err2 } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_id', transactionId)
    .maybeSingle()
  
  if (order2) {
    console.log('   ✅ Found:', order2.order_number)
  } else {
    console.log('   ❌ Not found')
    console.log('   Error:', err2)
  }
  
  // 4. Check all orders for this customer
  console.log('\n4️⃣ ALL ORDERS FOR CUSTOMER:')
  const { data: allOrders } = await supabase
    .from('orders')
    .select('order_number, payment_id, status, total_amount')
    .eq('customer_email', 'rekiseu@gmail.com')
    .order('created_at', { ascending: false })
    .limit(5)
  
  allOrders?.forEach(o => {
    console.log(`   - ${o.order_number}: payment_id=${o.payment_id || 'NULL'}, status=${o.status}, total=$${o.total_amount}`)
  })
  
  console.log('\n' + '='.repeat(50))
  console.log('✅ Check Complete!')
}

checkEverything().catch(console.error)
