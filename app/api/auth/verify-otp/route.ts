import { NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/utils/auth'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { sendWelcomeEmail } from '@/lib/services/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, code, type } = body

    if (!email || !code || !type) {
      return NextResponse.json(
        { success: false, error: 'Email, code, and type are required' },
        { status: 400 }
      )
    }

    // Verify OTP
    const verification = await verifyOTP(email, code, type)

    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Invalid OTP code' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Update user verification status
    if (type === 'email') {
      const { data: user, error } = await supabase
        .from('customers')
        .update({
          email_verified: true,
          is_verified: true, // Consider user fully verified after email
        })
        .eq('email', email)
        .select()
        .single()

      if (error) {
        console.error('Error updating user:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to verify email' },
          { status: 500 }
        )
      }

      // Send welcome email
      await sendWelcomeEmail(email, user.name)

      return NextResponse.json({
        success: true,
        message: 'Email verified successfully! Welcome to PKT Store.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isVerified: true,
          emailVerified: true,
          phoneVerified: user.phone_verified,
          createdAt: user.created_at,
        },
      })
    }

    if (type === 'phone') {
      const { data: user, error } = await supabase
        .from('customers')
        .update({ phone_verified: true })
        .eq('email', email)
        .select()
        .single()

      if (error) {
        console.error('Error updating user:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to verify phone' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Phone verified successfully!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isVerified: user.is_verified,
          emailVerified: user.email_verified,
          phoneVerified: true,
          createdAt: user.created_at,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    })
  } catch (error: any) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
