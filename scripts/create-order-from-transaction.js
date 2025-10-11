/**
 * Manual Order Creation Script
 * Use this to create an order from a completed payment transaction
 * 
 * Usage:
 * 1. Find your completed transaction ID from database or logs
 * 2. Run: node scripts/create-order-from-transaction.js <TRANSACTION_ID>
 */

const TRANSACTION_ID = process.argv[2];

if (!TRANSACTION_ID) {
  console.error('❌ Please provide a transaction ID');
  console.log('Usage: node scripts/create-order-from-transaction.js <TRANSACTION_ID>');
  process.exit(1);
}

async function createOrderFromTransaction() {
  try {
    console.log('📦 Creating order from transaction:', TRANSACTION_ID);
    console.log('');

    const response = await fetch('http://localhost:3000/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionId: TRANSACTION_ID,
      }),
    });

    const data = await response.json();

    console.log('📥 Response Status:', response.status);
    console.log('📥 Response:', JSON.stringify(data, null, 2));
    console.log('');

    if (response.ok && data.success) {
      console.log('✅ SUCCESS! Order created:');
      console.log('   Order Number:', data.order.order_number);
      console.log('   Order ID:', data.order.id);
      console.log('   Total Amount: $' + data.order.total_amount);
      console.log('');
      console.log('🎉 You can now see this order at: http://localhost:3000/orders');
    } else {
      console.log('❌ FAILED to create order');
      console.log('   Error:', data.error || 'Unknown error');
      console.log('');
      console.log('💡 Possible issues:');
      console.log('   1. Transaction not found');
      console.log('   2. Transaction not completed (status must be "completed")');
      console.log('   3. Transaction has no user_id (guest checkout)');
      console.log('   4. Customer record not found in database');
      console.log('');
      console.log('🔍 Check transaction in database:');
      console.log('   SELECT * FROM payment_transactions WHERE id = \'' + TRANSACTION_ID + '\';');
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('');
    console.log('💡 Make sure:');
    console.log('   1. Dev server is running (npm run dev)');
    console.log('   2. Transaction ID is correct');
  }
}

createOrderFromTransaction();
