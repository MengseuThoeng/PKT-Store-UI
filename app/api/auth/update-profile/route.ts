import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db/supabase'
import { verifySession } from '@/lib/utils/auth'
import { cookies } from 'next/headers'

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sessionResult = await verifySession(token)
    if (!sessionResult.success || !sessionResult.session) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone } = body

    // Validate inputs
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Update user in database
    const { data, error } = await supabase
      .from('customers')
      .update({
        name: name.trim(),
        phone: phone?.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionResult.session.customer_id)
      .select('id, name, email, phone, is_verified, email_verified, phone_verified, created_at, last_login')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // Transform to User type
    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      isVerified: data.is_verified,
      emailVerified: data.email_verified,
      phoneVerified: data.phone_verified,
      createdAt: data.created_at,
      lastLogin: data.last_login
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
