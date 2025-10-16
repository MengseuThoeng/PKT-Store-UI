import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { hashPassword, isValidEmail, isValidPassword } from '@/lib/utils/auth'
import { generateOTP, saveOTP } from '@/lib/utils/auth'
import { sendOTPEmail } from '@/lib/services/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, password, address } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const passwordValidation = isValidPassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.message },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('customers')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('customers')
      .insert({
        name,
        email,
        phone: phone || 'N/A',
        address: address || 'Cambodia',
        password_hash: passwordHash,
        is_verified: false,
        email_verified: false,
        phone_verified: false,
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json(
        { success: false, error: 'Failed to create account' },
        { status: 500 }
      )
    }

    // Generate and send OTP
    const otp = generateOTP()
    await saveOTP(email, otp, 'email')
    await sendOTPEmail(email, otp, 'registration')

    return NextResponse.json({
      success: true,
      message: 'Account created! Please check your email for verification code.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        isVerified: false,
        emailVerified: false,
        phoneVerified: false,
        createdAt: newUser.created_at,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    )
  }
}
