import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'

// Load .env.local file
config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

console.log('🔍 Testing Supabase Connection...')
console.log('URL:', supabaseUrl)
console.log('Service Key:', supabaseServiceKey ? '✓ Found' : '✗ Missing')

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  try {
    console.log('\n📡 Testing database connection...')
    
    // Test simple query
    const { data, error, status } = await supabase
      .from('figures')
      .select('id, name')
      .limit(1)
    
    if (error) {
      console.error('❌ Database Error:', error)
      console.error('Status:', status)
      console.error('Hint:', error.hint || 'No hint available')
      return
    }
    
    console.log('✅ Connection successful!')
    console.log('Sample data:', data)
    
    // Get count
    const { count } = await supabase
      .from('figures')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📊 Total figures in database: ${count}`)
    
  } catch (err: any) {
    console.error('❌ Connection failed:', err.message)
    console.error('Full error:', err)
    
    if (err.message.includes('fetch failed')) {
      console.log('\n💡 Possible causes:')
      console.log('1. Supabase project is paused (free tier)')
      console.log('2. Network/firewall blocking the connection')
      console.log('3. Invalid Supabase URL or credentials')
      console.log('\n📝 Solution:')
      console.log('→ Go to https://supabase.com/dashboard')
      console.log('→ Select your project: vfuzolwltlkoqvlwsnvj')
      console.log('→ Click "Resume project" if it shows paused')
    }
  }
}

testConnection()
