require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdminUser() {
  console.log('🔧 Creating Admin User...\n');

  const adminData = {
    name: 'Admin User',
    email: 'admin@pktstore.com',
    password: 'admin123456', // Change this password after first login!
    phone: '0123456789',
  };

  try {
    // Check if admin already exists
    const { data: existing } = await supabase
      .from('customers')
      .select('id, email, is_admin')
      .eq('email', adminData.email)
      .single();

    if (existing) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${existing.email}`);
      console.log(`   Admin: ${existing.is_admin}`);
      
      if (!existing.is_admin) {
        console.log('\n🔄 Setting is_admin = true...');
        const { error } = await supabase
          .from('customers')
          .update({ is_admin: true })
          .eq('id', existing.id);

        if (error) {
          console.error('❌ Error:', error.message);
        } else {
          console.log('✅ User is now admin!');
        }
      }
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    console.log('👤 Creating admin user...');
    const { data: newAdmin, error } = await supabase
      .from('customers')
      .insert([{
        name: adminData.name,
        email: adminData.email,
        phone: adminData.phone,
        password_hash: passwordHash,
        is_admin: true,
        is_verified: true,
        email_verified: true,
        phone_verified: true,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating admin:', error.message);
      return;
    }

    console.log('\n✅ Admin user created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📋 ADMIN LOGIN CREDENTIALS:');
    console.log('═══════════════════════════════════════');
    console.log(`Email:    ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log('═══════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
    console.log('\nYou can now login at: http://localhost:3000/login');
    console.log('After login, you will be redirected to: http://localhost:3000/admin\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminUser();
