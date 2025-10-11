const crypto = require('crypto');

// Your actual credentials
const publicKey = '765ab98e7c0a2f07411bc7a31c613ccdddab9f7a';
const merchantId = 'ec462057';

// Example data (simplified)
const data = {
  req_time: '20251008223228',
  merchant_id: merchantId,
  tran_id: '251008223228414dkv9g',
  amount: '10.50',
  items: 'W3sibmFtZSI6IkJsYWNrIENsb3ZlciIsInF1YW50aXR5IjoxLCJwcmljZSI6MTAuNX1d',
  shipping: '',
  first_name: 'REKI',
  last_name: 'SEU',
  email: 'rekiseu@gmail.com',
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

console.log('\n🧪 ABA PayWay Hash Generation Test\n');
console.log('=' .repeat(60));

// Build hash string EXACTLY as PHP does
const b4hash = 
  data.req_time +
  data.merchant_id +
  data.tran_id +
  data.amount +
  data.items +
  data.shipping +
  data.first_name +
  data.last_name +
  data.email +
  data.phone +
  data.type +
  data.payment_option +
  data.return_url +
  data.cancel_url +
  data.continue_success_url +
  data.return_deeplink +
  data.currency +
  data.custom_fields +
  data.return_params +
  data.payout +
  data.lifetime +
  data.additional_params +
  data.google_pay_token +
  data.skip_success_page;

console.log('\n📝 Hash String Components:');
console.log('  req_time:', data.req_time);
console.log('  merchant_id:', data.merchant_id);
console.log('  tran_id:', data.tran_id);
console.log('  amount:', data.amount);
console.log('  items (base64):', data.items.substring(0, 30) + '...');
console.log('  shipping:', `"${data.shipping}"`);
console.log('  first_name:', data.first_name);
console.log('  last_name:', data.last_name);
console.log('  email:', data.email);
console.log('  phone:', data.phone);
console.log('  type:', data.type);
console.log('  payment_option:', data.payment_option);
console.log('  return_url:', data.return_url);
console.log('  cancel_url:', `"${data.cancel_url}"`);
console.log('  continue_success_url:', data.continue_success_url);
console.log('  return_deeplink:', `"${data.return_deeplink}"`);
console.log('  currency:', data.currency);
console.log('  (All remaining fields are empty strings)');

console.log('\n🔤 Complete Hash String:');
console.log('  Length:', b4hash.length);
console.log('  First 100 chars:', b4hash.substring(0, 100));
console.log('  Last 100 chars:', b4hash.substring(b4hash.length - 100));
console.log('  Full string:', b4hash);

// Generate hash using HMAC SHA-512 (matching PHP)
console.log('\n🔐 Hash Generation:');
console.log('  Method: HMAC SHA-512');
console.log('  Secret Key:', publicKey);

const hmac = crypto.createHmac('sha512', publicKey);
hmac.update(b4hash);
const hash = hmac.digest('base64');

console.log('  Generated Hash:', hash);
console.log('  Hash Length:', hash.length);

console.log('\n' + '='.repeat(60));
console.log('\n✅ This is the hash that should be sent to ABA PayWay');
console.log('   Copy this hash and compare with what your app generates\n');
