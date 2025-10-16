import { NextResponse } from 'next/server'
import { generateOTP, saveOTP } from '@/lib/utils/auth'
import { sendOTPEmail } from '@/lib/services/email'
import { createServerSupabaseClient } from '@/lib/db/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, type } = body

    if (!email || !type) {
      return NextResponse.json(
        { success: false, error: 'Email and type are required' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Check if user exists
    const { data: user } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single()

    if (!user && type !== 'password_reset') {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    console.log('📧 Generated OTP for', email, '- Code:', otp, '- Type:', type)
    await saveOTP(email, otp, type)

    // Send OTP via email
    const emailType = type === 'password_reset' ? 'password_reset' : 'registration'
    await sendOTPEmail(email, otp, emailType)
    console.log('✅ OTP sent successfully to', email)

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${email}. Please check your email.`,
    })
  } catch (error: any) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
