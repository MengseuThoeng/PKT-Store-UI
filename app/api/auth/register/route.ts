import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { hashPassword, isValidEmail, isValidPassword } from '@/lib/utils/auth'
import { generateOTP, saveOTP } from '@/lib/utils/auth'
import { sendOTPEmail } from '@/lib/services/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, password, address } = body

    console.log('📝 Registration attempt:', { name, email, phone: phone ? '***' : 'none', hasPassword: !!password })

    // Validation
    if (!name || !email || !password) {
      console.log('❌ Validation failed: Missing fields')
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      console.log('❌ Validation failed: Invalid email format')
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const passwordValidation = isValidPassword(password)
    if (!passwordValidation.valid) {
      console.log('❌ Validation failed: Weak password -', passwordValidation.message)
      return NextResponse.json(
        { success: false, error: passwordValidation.message },
        { status: 400 }
      )
    }

    console.log('✅ Validation passed, checking database...')

    const supabase = createServerSupabaseClient()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('customers')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      console.log('❌ Email already registered:', email)
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    console.log('✅ Email available, creating user...')

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('customers')
      .insert({
        name,
        email,
        phone: phone || null,
        address: address || null,
        password_hash: passwordHash,
        is_verified: false,
        email_verified: false,
        phone_verified: false,
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating user:', createError)
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    )
  }
}
