require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Found' : 'Missing')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Found' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTransaction() {
  const transactionId = '7bee99a2-a7e7-407e-b38d-c05f1794f601'
  
  console.log('🔍 Checking transaction:', transactionId)
  console.log('---')
  
  // Get transaction
  const { data: transaction, error: txError } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('id', transactionId)
    .single()
  
  if (txError) {
    console.error('❌ Transaction error:', txError)
    return
  }
  
  if (!transaction) {
    console.error('❌ Transaction not found')
    return
  }
  
  console.log('✅ Transaction found:')
  console.log('  ID:', transaction.id)
  console.log('  Status:', transaction.status)
  console.log('  Amount:', transaction.amount)
  console.log('  Payment Method:', transaction.payment_method)
  console.log('  Customer Name:', transaction.customer_name)
  console.log('  Customer Email:', transaction.customer_email)
  console.log('  Customer Phone:', transaction.customer_phone)
  console.log('  User ID:', transaction.user_id || '❌ NULL')
  console.log('  Created:', transaction.created_at)
  console.log('')
  
  // Check if user_id exists
  if (!transaction.user_id) {
    console.error('❌ PROBLEM: Transaction has no user_id!')
    console.log('This means the user was not authenticated when payment was made.')
    console.log('')
  }
  
  // Try to find customer by user_id
  if (transaction.user_id) {
    console.log('🔍 Looking for customer with user_id:', transaction.user_id)
    const { data: customer, error: custError } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', transaction.user_id)
      .single()
    
    if (custError || !customer) {
      console.error('❌ PROBLEM: Customer not found for user_id:', transaction.user_id)
      console.error('Error:', custError)
      console.log('')
      
      // Try to find by email
      console.log('🔍 Trying to find customer by email:', transaction.customer_email)
      const { data: customerByEmail, error: emailError } = await supabase
        .from('customers')
        .select('*')
        .eq('email', transaction.customer_email)
        .single()
      
      if (emailError || !customerByEmail) {
        console.error('❌ Customer not found by email either')
        console.log('')
        console.log('💡 SOLUTION: Need to create customer record or fix user_id')
      } else {
        console.log('✅ Found customer by email:')
        console.log('  ID:', customerByEmail.id)
        console.log('  Name:', customerByEmail.name)
        console.log('  Email:', customerByEmail.email)
        console.log('  User ID:', customerByEmail.user_id || '❌ NULL')
        console.log('')
        console.log('💡 SOLUTION: Update transaction.user_id to:', customerByEmail.user_id || 'Need to set user_id on customer')
      }
    } else {
      console.log('✅ Customer found:')
      console.log('  ID:', customer.id)
      console.log('  Name:', customer.name)
      console.log('  Email:', customer.email)
      console.log('  User ID:', customer.user_id)
      console.log('')
    }
  }
  
  // Check if order exists
  console.log('🔍 Checking if order already exists...')
  const { data: existingOrder, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_id', transaction.id)
    .single()
  
  if (existingOrder) {
    console.log('✅ Order already exists:')
    console.log('  Order Number:', existingOrder.order_number)
    console.log('  Status:', existingOrder.status)
    console.log('  Total:', existingOrder.total_amount)
  } else {
    console.log('❌ No order found for this transaction')
    if (orderError && orderError.code !== 'PGRST116') {
      console.log('Error:', orderError)
    }
  }
  
  console.log('')
  console.log('---')
  console.log('📋 SUMMARY:')
  if (!transaction.user_id) {
    console.log('❌ Transaction missing user_id - user was not logged in!')
  } else if (!customer) {
    console.log('❌ Customer record not found - database sync issue!')
  } else if (existingOrder) {
    console.log('✅ Order already exists - no action needed')
  } else {
    console.log('❓ Ready to create order - run the create order API')
  }
}

checkTransaction().catch(console.error)
