require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function addAdminColumn() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Add is_admin column
    console.log('🔧 Adding is_admin column...');
    await client.query(`
      ALTER TABLE customers 
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
    `);
    console.log('✅ Column added\n');

    // Create index
    console.log('📊 Creating index...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_customers_is_admin ON customers(is_admin);
    `);
    console.log('✅ Index created\n');

    // Set admin user
    console.log('👑 Setting admin user...');
    const result = await client.query(`
      UPDATE customers 
      SET is_admin = true 
      WHERE email = 'rekiseu@gmail.com'
      RETURNING id, name, email, is_admin;
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Admin user set:');
      console.log(`   Name: ${result.rows[0].name}`);
      console.log(`   Email: ${result.rows[0].email}`);
      console.log(`   Admin: ${result.rows[0].is_admin}\n`);
    } else {
      console.log('⚠️ No user found with that email\n');
    }

    // List all admins
    const admins = await client.query(`
      SELECT id, name, email, is_admin 
      FROM customers 
      WHERE is_admin = true;
    `);

    console.log('📋 All admin users:');
    admins.rows.forEach(admin => {
      console.log(`   - ${admin.name} (${admin.email})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('\n✅ Database connection closed');
  }
}

addAdminColumn();
