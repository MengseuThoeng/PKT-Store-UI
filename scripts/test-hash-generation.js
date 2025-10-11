const crypto = require('crypto');

// Test data from your actual request
const testData = {
  req_time: '20251008222813',
  merchant_id: 'ec462057',
  tran_id: '25100822281346xkmev4',
  amount: '10.50',
  items: 'W3sibmFtZSI6IkJsYWNrIENsb3ZlciIsInF1YW50aXR5IjoxLCJwcmljZSI6MTAuNX1d',
  shipping: '',
  first_name: 'REKI',
  last_name: 'SEU',
  email: 'reki@gmail.com',
  phone: '077441577',
  type: 'purchase',
  payment_option: 'cards',
  return_url: 'http://localhost:3000/payment/success?orderId=xxx',
  cancel_url: '',
  continue_success_url: 'http://localhost:3000/payment/success?orderId=xxx',
  return_deeplink: '',
  currency: 'USD',
  custom_fields: '',
  return_params: '',
  payout: '',
  lifetime: '',
  additional_params: '',
  google_pay_token: '',
  skip_success_page: ''
};

// Your public key from .env
const publicKey = process.env.ABA_PAYWAY_PUBLIC_KEY || 'YOUR_PUBLIC_KEY_HERE';

console.log('\n📋 Testing ABA Hash Generation\n');
console.log('Public Key (first 50 chars):', publicKey.substring(0, 50) + '...');

// Build the hash string exactly as PHP does
const b4hash = 
  testData.req_time +
  testData.merchant_id +
  testData.tran_id +
  testData.amount +
  testData.items +
  testData.shipping +
  testData.first_name +
  testData.last_name +
  testData.email +
  testData.phone +
  testData.type +
  testData.payment_option +
  testData.return_url +
  testData.cancel_url +
  testData.continue_success_url +
  testData.return_deeplink +
  testData.currency +
  testData.custom_fields +
  testData.return_params +
  testData.payout +
  testData.lifetime +
  testData.additional_params +
  testData.google_pay_token +
  testData.skip_success_page;

console.log('\n🔤 Hash String (first 200 chars):');
console.log(b4hash.substring(0, 200));
console.log('\n📏 Hash String Length:', b4hash.length);

// Generate hash using HMAC SHA-512 (matching PHP: base64_encode(hash_hmac('sha512', $b4hash, $api_key, true)))
const hmac = crypto.createHmac('sha512', publicKey);
hmac.update(b4hash);
const hash = hmac.digest('base64');

console.log('\n🔐 Generated Hash:');
console.log(hash);
console.log('\n📏 Hash Length:', hash.length);

// Show breakdown
console.log('\n📊 Hash String Breakdown:');
console.log('req_time:', testData.req_time);
console.log('merchant_id:', testData.merchant_id);
console.log('tran_id:', testData.tran_id);
console.log('amount:', testData.amount);
console.log('items (base64):', testData.items);
console.log('shipping:', `'${testData.shipping}'`);
console.log('first_name:', testData.first_name);
console.log('last_name:', testData.last_name);
console.log('email:', testData.email);
console.log('phone:', testData.phone);
console.log('type:', testData.type);
console.log('payment_option:', testData.payment_option);
console.log('return_url:', testData.return_url);
console.log('cancel_url:', `'${testData.cancel_url}'`);
console.log('continue_success_url:', testData.continue_success_url);
console.log('return_deeplink:', `'${testData.return_deeplink}'`);
console.log('currency:', testData.currency);
console.log('All remaining fields:', 'empty strings');
