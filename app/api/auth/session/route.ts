import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/utils/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({
        success: false,
        isAuthenticated: false,
      })
    }

    // Verify session
    const session = await verifySession(token)

    if (!session.success || !session.session) {
      // Clear invalid cookie
      cookieStore.delete('auth_token')
      
      return NextResponse.json({
        success: false,
        isAuthenticated: false,
      })
    }

    const customer = session.session.customers as any

    return NextResponse.json({
      success: true,
      isAuthenticated: true,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        isVerified: customer.is_verified,
        emailVerified: customer.email_verified,
        phoneVerified: customer.phone_verified,
        isAdmin: customer.is_admin || false,
      },
    })
  } catch (error: any) {
    console.error('Session check error:', error)
    return NextResponse.json({
      success: false,
      isAuthenticated: false,
    })
  }
}
