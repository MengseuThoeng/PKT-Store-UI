require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSessions() {
  console.log('🔍 Checking Active Sessions...\n');

  try {
    // Get all active sessions
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        *,
        customers:customer_id (
          id,
          name,
          email,
          is_admin
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    if (!sessions || sessions.length === 0) {
      console.log('⚠️  No active sessions found');
      return;
    }

    console.log('📋 Active Sessions:');
    console.log('═══════════════════════════════════════════════════════════');
    sessions.forEach((session, index) => {
      const customer = Array.isArray(session.customers) ? session.customers[0] : session.customers;
      console.log(`\n${index + 1}. Session:`);
      console.log(`   Customer: ${customer?.name || 'N/A'}`);
      console.log(`   Email: ${customer?.email || 'N/A'}`);
      console.log(`   Is Admin: ${customer?.is_admin || false}`);
      console.log(`   Session ID: ${session.id}`);
      console.log(`   Customer ID: ${session.customer_id}`);
      console.log(`   Created: ${new Date(session.created_at).toLocaleString()}`);
      console.log(`   Expires: ${new Date(session.expires_at).toLocaleString()}`);
    });
    console.log('\n═══════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSessions();
