import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { hashPassword, verifyOTP } from '@/lib/utils/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code, newPassword } = body

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Email, code, and new password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Verify OTP code
    console.log('🔍 Verifying OTP:', { email, code: code.substring(0, 2) + '****', type: 'password_reset' })
    const otpVerification = await verifyOTP(email, code, 'password_reset')
    
    if (!otpVerification.success) {
      console.error('❌ OTP verification failed:', otpVerification.error)
      return NextResponse.json(
        { success: false, error: otpVerification.error || 'Invalid or expired code' },
        { status: 400 }
      )
    }
    console.log('✅ OTP verified successfully')

    const supabase = createServerSupabaseClient()

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('customers')
      .select('id, email')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password in database
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        password_hash: hashedPassword,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email)

    if (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update password' },
        { status: 500 }
      )
    }

    // Mark OTP as used
    await supabase
      .from('otp_codes')
      .update({ used: true })
      .eq('email', email)
      .eq('code', code)
      .eq('type', 'password_reset')

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    })
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
