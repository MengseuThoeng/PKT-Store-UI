import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createServerSupabaseClient } from '@/lib/db/supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this'
const OTP_EXPIRY_MINUTES = 3

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate JWT token
 */
export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' } // Token valid for 7 days
  )
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch (error) {
    return null
  }
}

/**
 * Generate 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Save OTP to database
 */
export async function saveOTP(
  email: string,
  code: string,
  type: 'email' | 'phone' | 'password_reset',
  phone?: string
) {
  const supabase = createServerSupabaseClient()
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES)

  const { data, error } = await supabase
    .from('otp_codes')
    .insert({
      email,
      phone,
      code,
      type,
      expires_at: expiresAt.toISOString(),
      used: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving OTP:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(
  email: string,
  code: string,
  type: 'email' | 'phone' | 'password_reset'
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  // Find unused OTP that hasn't expired
  const { data: otpData, error } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('email', email)
    .eq('code', code)
    .eq('type', type)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !otpData) {
    return { success: false, error: 'Invalid or expired OTP code' }
  }

  // Mark OTP as used
  await supabase
    .from('otp_codes')
    .update({ used: true })
    .eq('id', otpData.id)

  return { success: true }
}

/**
 * Clean up expired OTPs (run periodically)
 */
export async function cleanupExpiredOTPs() {
  const supabase = createServerSupabaseClient()
  
  const { error } = await supabase
    .from('otp_codes')
    .delete()
    .lt('expires_at', new Date().toISOString())

  if (error) {
    console.error('Error cleaning up OTPs:', error)
  }
}

/**
 * Create user session
 */
export async function createSession(
  customerId: string,
  token: string,
  userAgent?: string,
  ipAddress?: string
) {
  const supabase = createServerSupabaseClient()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // Session valid for 7 days

  const { data, error } = await supabase
    .from('user_sessions')
    .insert({
      customer_id: customerId,
      token,
      expires_at: expiresAt.toISOString(),
      user_agent: userAgent,
      ip_address: ipAddress,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating session:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

/**
 * Verify session token
 */
export async function verifySession(token: string) {
  const supabase = createServerSupabaseClient()

  const { data: session, error } = await supabase
    .from('user_sessions')
    .select(`
      *,
      customers:customer_id (
        id,
        name,
        email,
        phone,
        is_verified,
        email_verified,
        phone_verified,
        is_admin
      )
    `)
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error || !session) {
    return { success: false, error: 'Invalid or expired session' }
  }

  // Update last activity
  await supabase
    .from('user_sessions')
    .update({ last_activity: new Date().toISOString() })
    .eq('id', session.id)

  return { success: true, session }
}

/**
 * Delete session (logout)
 */
export async function deleteSession(token: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('user_sessions')
    .delete()
    .eq('token', token)

  if (error) {
    console.error('Error deleting session:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  return { valid: true }
}

/**
 * Validate phone number (Cambodia format)
 */
export function isValidPhone(phone: string): boolean {
  // Cambodia phone format: +855 or 0 followed by 8-9 digits
  const phoneRegex = /^(\+855|0)[1-9]\d{7,8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}
