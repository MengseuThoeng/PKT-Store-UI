# Forgot Password Testing Guide

## 🧪 How to Test Reset Password Flow

### **Step 1: Request Reset Code**
1. Go to `/login`
2. Click "Forgot password?" link
3. Enter your email (e.g., `admin@pkt.com`)
4. Click "Send Reset Code"
5. **Check terminal logs** for:
   ```
   📧 Generated OTP for admin@pkt.com - Code: 123456 - Type: password_reset
   ✅ OTP sent successfully to admin@pkt.com
   ```

### **Step 2: Check Email**
- Look for email with subject: "Reset Your Password"
- Copy the 6-digit code

### **Step 3: Reset Password**
1. You'll be redirected to `/reset-password?email=admin@pkt.com`
2. Enter the 6-digit code from email (or from terminal logs)
3. Enter new password (must meet requirements):
   - At least 8 characters
   - One uppercase letter
   - One lowercase letter
   - One number
4. Confirm password
5. Click "Reset Password"
6. **One API call** to `/api/auth/reset-password` (includes OTP verification)

### **Step 4: Check Terminal Logs**
When you submit, you should see:
```
🔍 Verifying OTP: { email, code: '12****', type: 'password_reset' }
🔎 Checking OTP in database: { email, code: '12****', type, currentTime }
✅ OTP found and valid, marking as used
✅ OTP verified successfully
Password updated successfully
```

---

## 🐛 Common Issues & Solutions

### **"Invalid or expired OTP code"**

**Check terminal logs for details:**

1. **Code Already Used:**
   ```
   Found OTP but: { used: true, expired: false }
   Error: "This code has already been used. Please request a new one."
   ```
   **Solution:** Click "Didn't receive code? Resend" to get a new code

2. **Code Expired (3 minutes):**
   ```
   Found OTP but: { used: false, expired: true, expiresAt: '2025-10-16T10:00:00' }
   Error: "Code expired. Please request a new one."
   ```
   **Solution:** Request a new code

3. **Wrong Code:**
   ```
   ❌ OTP not found or expired
   Error: "Invalid OTP code"
   ```
   **Solution:** Check the code in your email carefully

4. **Wrong Email:**
   - Make sure email matches exactly
   - Check for typos

---

## 🔍 Debug Checklist

### **If OTP is not being sent:**
1. Check terminal for email service errors
2. Verify email service configuration in `.env`
3. Check Supabase `otp_codes` table

### **If OTP verification fails:**
1. Check terminal logs for exact error
2. Query Supabase directly:
   ```sql
   SELECT * FROM otp_codes 
   WHERE email = 'admin@pkt.com' 
   AND type = 'password_reset'
   ORDER BY created_at DESC 
   LIMIT 1;
   ```
3. Verify:
   - `used = false`
   - `expires_at > NOW()`
   - `code` matches what you entered

### **If password reset fails:**
1. Check password meets requirements:
   - ✅ At least 8 characters
   - ✅ One uppercase letter
   - ✅ One lowercase letter
   - ✅ One number
   - ✅ Passwords match
2. Check terminal for database errors

---

## 📊 Database Schema

### **otp_codes table:**
```sql
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY,
  email VARCHAR NOT NULL,
  code VARCHAR(6) NOT NULL,
  type VARCHAR NOT NULL, -- 'email' | 'phone' | 'password_reset'
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Expected flow:**
1. **INSERT** new OTP with `used = false`, `expires_at = NOW() + 3 minutes`
2. **SELECT** to verify (check used=false, expires_at>NOW())
3. **UPDATE** set `used = true` after successful verification
4. **UPDATE** `customers.password_hash` with new hashed password

---

## ✅ Success Criteria

### **Forgot Password Page:**
- ✅ Email input works
- ✅ Loading state shows during send
- ✅ Toast notification on success/error
- ✅ Redirects to reset page with email in URL
- ✅ "Back to Login" link works
- ✅ Pink-to-rose gradient design

### **Reset Password Page:**
- ✅ Email pre-filled from URL
- ✅ 6-digit code input (numbers only)
- ✅ Password strength meter works
- ✅ Live validation checkmarks
- ✅ Show/hide password toggles
- ✅ Resend code button works
- ✅ Detailed error messages
- ✅ Success redirects to login
- ✅ Pink-to-rose gradient design

### **API Endpoints:**
- ✅ `POST /api/auth/send-otp` - Generates & sends code
- ✅ `POST /api/auth/reset-password` - Verifies OTP & updates password (all-in-one)
- ⚠️ `POST /api/auth/verify-otp` - Not used in reset flow (used for email/phone verification only)

---

## 🎯 Quick Test Commands

### **1. Send OTP:**
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pkt.com","type":"password_reset"}'
```

### **2. Check terminal for code:**
```
📧 Generated OTP for admin@pkt.com - Code: 123456
```

### **3. Reset password:**
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@pkt.com",
    "code":"123456",
    "newPassword":"NewPass123!"
  }'
```

### **4. Test login with new password:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@pkt.com",
    "password":"NewPass123!"
  }'
```

---

## 📝 Notes

- OTP expires in **3 minutes**
- Code is **6 digits** (100000-999999)
- Each code can only be used **once**
- Password must be **8+ characters** with uppercase, lowercase, and numbers
- All errors now show detailed messages in terminal logs
- Toast notifications show user-friendly messages

**Check terminal logs for detailed debugging info!** 🔍
