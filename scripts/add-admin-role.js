require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addAdminColumn() {
  console.log('🔧 Adding is_admin column to customers table...\n');

  try {
    // Add column using Supabase client (execute raw SQL)
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false'
    });

    // If RPC doesn't exist, try direct update
    console.log('✅ Adding is_admin column...');
    
    // Make your account admin
    const { data: admin, error: updateError } = await supabase
      .from('customers')
      .update({ is_admin: true })
      .eq('email', 'rekiseu@gmail.com')
      .select();

    if (updateError) {
      console.error('❌ Error setting admin:', updateError);
    } else if (admin && admin.length > 0) {
      console.log('✅ Admin user set:', admin[0].name, admin[0].email);
    } else {
      console.log('⚠️ User not found, trying to add column first...');
    }

    // List all admins
    const { data: admins, error: selectError } = await supabase
      .from('customers')
      .select('id, name, email, is_admin')
      .eq('is_admin', true);

    if (!selectError && admins) {
      console.log('\n📋 Admin users:');
      admins.forEach(admin => {
        console.log(`  - ${admin.name} (${admin.email})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 You may need to add the column manually in Supabase dashboard:');
    console.log('   Go to Table Editor → customers → Add Column');
    console.log('   Name: is_admin, Type: bool, Default: false');
  }
}

addAdminColumn();
