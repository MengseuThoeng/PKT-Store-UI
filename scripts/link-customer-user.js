require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function linkCustomerToUser() {
  const customerId = 'f98e246a-d729-4e15-90a9-70ea5046c035'
  
  console.log('🔗 Linking customer to user...')
  console.log('Customer ID:', customerId)
  console.log('')
  
  // Check current state
  const { data: before } = await supabase
    .from('customers')
    .select('id, name, email, user_id')
    .eq('id', customerId)
    .single()
  
  console.log('BEFORE:')
  console.log('  Name:', before.name)
  console.log('  Email:', before.email)  
  console.log('  User ID:', before.user_id || 'NULL')
  console.log('')
  
  // Set user_id to customer_id (they will be the same)
  const { data: updated, error } = await supabase
    .from('customers')
    .update({ user_id: customerId })
    .eq('id', customerId)
    .select('id, name, email, user_id')
    .single()
  
  if (error) {
    console.error('❌ Update failed:', error)
    return
  }
  
  console.log('AFTER:')
  console.log('  Name:', updated.name)
  console.log('  Email:', updated.email)
  console.log('  User ID:', updated.user_id || 'NULL')
  console.log('')
  
  if (updated.user_id) {
    console.log('✅ Customer linked to user_id:', updated.user_id)
  } else {
    console.log('❌ Failed to set user_id')
  }
}

linkCustomerToUser().catch(console.error)
