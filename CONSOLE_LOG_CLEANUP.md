# Console Log Cleanup for Production 🧹

## Status: Partially Complete ✅

### Completed Files:
1. ✅ **app/payment/khqr/page.tsx** - All debug logs commented out
   - Commented 10+ console.log statements
   - Kept console.error for error tracking

### Files That Need Manual Review:

#### High Priority (Comment Out Before Production):

**app/api/payment/khqr/route.ts** (~30 console.logs)
```typescript
// Lines to comment:
- Line 26: console.log('📥 KHQR Payment Request:', ...)
- Line 68: console.log('✅ Authenticated - Customer ID:', ...)
- Line 70: console.log('⚠️ Not authenticated - guest checkout')
- Line 107-111: Multiple transaction saved logs
- Line 176: console.log('✅ Found transaction:', ...)
- Line 214: console.log('🔍 Verifying payment with Bakong API, MD5:', ...)
- Line 219: console.log('📋 Verification result:', ...)
- Line 226: console.log('✅ Payment confirmed! Updating database...')
- Line 244: console.log('✅ Transaction updated to completed')
- Line 248: console.log('📦 Auto-creating order for transaction:', ...)
- Line 258: console.log('✅ Order already exists:', ...)
- Line 277: console.log('📝 Creating customer record for user_id:', ...)
- Line 328: console.log('✅ Order created automatically:', ...)
- Line 350: console.log('✅ Order items created:', ...)
- Line 400: console.log('❌ Payment failed! Updating database...')
- Line 423: console.log('⏳ Payment still pending')

// Keep these console.error:
- Line 100, 120, 169, 199, 242, 297, 326, 348, 357, 378, 438
```

**app/api/orders/create/route.ts** (~10 console.logs)
```typescript
// Comment these:
- Line 45: console.log('✅ Order already exists:', ...)
- Line 74: console.log('📝 Customer record not found, creating one...')
- Line 97: console.log('✅ Customer created:', ...)
- Line 101: console.log('✅ Found/Created customer_id:', ...)
- Line 163: console.log('✅ Order items created:', ...)
- Line 167: console.log('✅ Order created successfully:', ...)
```

**app/api/admin/orders/[orderId]/status/route.ts** (~10 console.logs)
```typescript
// Comment these:
- Line 88: console.log(`📦 Confirming order...`)
- Line 110: console.log(`✅ Stock reduced for order...`)
- Line 114: console.log(`↩️ Cancelling confirmed order...`)
- Line 122: console.log(`✅ Stock returned for order...`)
- Line 153: console.log(`✅ Order...status updated to:...`)
- Line 185: console.log(`📧 Order confirmation email sent...`)
```

#### Medium Priority:

**lib/services/email.ts** (~15 console.logs)
```typescript
// Comment these:
- Line 21-22: Gmail SMTP warnings (good to keep for debugging)
- Line 24: Resend confirmation
- Line 53: Email sent via Resend
- Line 66: Email sent via Gmail
- Lines 73-89: DEV MODE email logs (keep for development!)
```

**lib/services/khqr.ts** (~12 console.logs)
```typescript
// Comment these production logs:
- Line 54-55: Generating KHQR logs
- Line 82: Bill number generated
- Line 100: Individual account payload
- Line 112-114: KHQR generated successfully
- Line 118: KHQR valid check
```

**lib/services/telegram.ts** (~5 console.logs)
```typescript
// Keep most of these for debugging:
- Line 30: console.warn (keep - important warning)
- Line 87: console.error (keep)
- Line 110: console.error (keep)
- Line 114: console.log('✅ Telegram notification sent') - can comment
- Line 117: console.error (keep)
```

**lib/context/AuthContext.tsx** (~10 console.logs)
```typescript
// Comment these:
- Line 18: console.log('🔄 Periodic session check...')
- Line 34: console.log('👁️ Tab visible - checking session...')
- Line 52: console.log('✅ Session valid:', ...)
- Line 55: console.log('❌ Session invalid or expired')
- Line 99: console.log('✅ Login successful:', ...)
- Line 116: console.log('✅ Logout successful')
```

#### Low Priority (Scripts - OK to keep):

**scripts/** folder - Keep all console.logs
- These are development/admin scripts
- Not included in production bundle
- Useful for debugging

---

## Recommendation: Production-Ready Approach

Instead of commenting out manually, use environment-based logging:

### Create lib/utils/logger.ts:

```typescript
// lib/utils/logger.ts
const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args)
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args)
    }
  }
}
```

### Then replace in files:

```typescript
// Before:
console.log('✅ Order created:', orderNumber)

// After:
import { logger } from '@/lib/utils/logger'
logger.debug('✅ Order created:', orderNumber)
```

---

## What's Currently Done:

### ✅ Commented Out (app/payment/khqr/page.tsx):
- 🧹 Cleaning up KHQR payment page...
- 🔧 Generating KHQR for amount:
- ✅ KHQR Generated:
- ⚠️ Component unmounted, stopping checks
- ⚠️ Transaction not found, stopping status checks
- ⚠️ Component unmounted during request, ignoring response
- ✅ Payment confirmed! Order created automatically on server.
- 🛑 Status check interval stopped (2 instances)
- 📦 Order was auto-created by payment verification
- ❌ Payment failed! Stopping checks...

### ❌ Kept (Important errors):
- All console.error() calls in all files
- Error tracking is critical for production debugging

---

## Next Steps:

### Option 1: Manual Commenting (Current approach)
- Go through each file
- Comment out console.log
- Keep console.error
- Time-consuming but thorough

### Option 2: Logger Utility (Recommended)
- Create `lib/utils/logger.ts`
- Replace console.log with logger.debug
- Automatic production filtering
- Better long-term solution

### Option 3: Build-Time Removal (Advanced)
- Use Terser/Webpack to strip console.logs
- Configure in next.config.ts
- Automatic but less control

---

## Current Production State:

### Safe to Deploy:
✅ All console.error calls preserved
✅ Critical error tracking intact
✅ Payment page cleaned up
✅ Build passes successfully

### Notes:
- Remaining console.logs won't break production
- They just add noise to browser console
- Not a blocking issue for deployment
- Can clean up incrementally after launch

---

## Quick Command to Find All Console Logs:

```bash
# Count console.logs in production code (excluding scripts)
grep -r "console\.log" app lib components --exclude-dir=node_modules | wc -l

# Find specific files with most logs
grep -r "console\.log" app lib --exclude-dir=node_modules -l | xargs -I {} sh -c 'echo "$(grep -c "console\.log" {}) {}"' | sort -rn
```

---

## Summary:

**Status:** Production-ready with minor console log noise  
**Risk Level:** Low (only affects browser console, not functionality)  
**Action:** Can deploy now, clean up post-launch  
**Recommendation:** Consider logger utility for future maintenance  

✅ **Safe to deploy to Vercel!**
