require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function runMigration() {
  console.log('🔧 Adding user_id column to customers table...')
  console.log('')
  
  // Read SQL file
  const sql = fs.readFileSync('./scripts/add-user-id-column.sql', 'utf8')
  
  console.log('SQL to execute:')
  console.log(sql)
  console.log('')
  
  // Execute SQL
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
  
  if (error) {
    console.error('❌ Migration failed:', error)
    console.log('')
    console.log('💡 Please run this SQL manually in Supabase SQL Editor:')
    console.log(sql)
    return
  }
  
  console.log('✅ Migration completed!')
  console.log('')
  
  // Now set user_id for existing customer
  console.log('🔗 Setting user_id for existing customers...')
  
  const customerId = 'f98e246a-d729-4e15-90a9-70ea5046c035'
  
  const { data: updated, error: updateError } = await supabase
    .from('customers')
    .update({ user_id: customerId })
    .eq('id', customerId)
    .select()
  
  if (updateError) {
    console.error('❌ Update failed:', updateError)
  } else {
    console.log('✅ Customer user_id set:', updated[0]?.user_id)
  }
}

runMigration().catch(console.error)
