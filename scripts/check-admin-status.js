require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAdminStatus() {
  console.log('🔍 Checking Admin Status...\n');

  try {
    // Check if column exists
    const { data: allCustomers, error } = await supabase
      .from('customers')
      .select('id, name, email, is_admin')
      .limit(5);

    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n⚠️  The is_admin column might not exist!');
      console.log('\n📋 Run this SQL in Supabase:');
      console.log('─────────────────────────────────────');
      console.log('ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;');
      console.log('UPDATE customers SET is_admin = true WHERE email = \'admin@pktstore.com\';');
      console.log('UPDATE customers SET is_admin = true WHERE email = \'rekiseu@gmail.com\';');
      console.log('─────────────────────────────────────\n');
      return;
    }

    console.log('✅ is_admin column exists!\n');
    console.log('📋 All customers:');
    console.log('─────────────────────────────────────');
    allCustomers?.forEach(customer => {
      console.log(`Name: ${customer.name}`);
      console.log(`Email: ${customer.email}`);
      console.log(`Admin: ${customer.is_admin || false}`);
      console.log('─────────────────────────────────────');
    });

    // Check specifically for admin users
    const { data: admins } = await supabase
      .from('customers')
      .select('*')
      .eq('is_admin', true);

    if (admins && admins.length > 0) {
      console.log('\n✅ Admin users found:');
      admins.forEach(admin => {
        console.log(`  - ${admin.name} (${admin.email})`);
      });
    } else {
      console.log('\n⚠️  No admin users found!');
      console.log('\nRun this to make yourself admin:');
      console.log('UPDATE customers SET is_admin = true WHERE email = \'your@email.com\';');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAdminStatus();
