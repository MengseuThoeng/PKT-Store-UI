import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { comparePassword, generateToken, createSession } from '@/lib/utils/auth'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Find user by email
    const { data: user, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user has password (might be social login only)
    if (!user.password_hash) {
      return NextResponse.json(
        { success: false, error: 'Please use social login or reset your password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (!user.email_verified) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please verify your email before logging in',
          needsVerification: true,
          email: user.email,
        },
        { status: 403 }
      )
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email)

    // Create session
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     undefined

    await createSession(user.id, token, userAgent, ipAddress)

    // Update last login
    await supabase
      .from('customers')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)

    // Set cookie
    const cookieStore = await cookies()
    const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60 // 7 days or 1 day
    
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: false, // Set to true only if using HTTPS
      sameSite: 'lax',
      maxAge,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.is_verified,
        emailVerified: user.email_verified,
        phoneVerified: user.phone_verified,
        isAdmin: user.is_admin || false,
        createdAt: user.created_at,
        lastLogin: new Date().toISOString(),
      },
      isAdmin: user.is_admin || false,
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}
