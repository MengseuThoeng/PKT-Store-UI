import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db/supabase'
import { verifySession } from '@/lib/utils/auth'
import { cookies } from 'next/headers'

// GET all addresses for user
export async function GET(request: NextRequest) {
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

    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', sessionResult.session.customer_id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch addresses' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      addresses: data || []
    })

  } catch (error) {
    console.error('Get addresses error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

// POST create new address
export async function POST(request: NextRequest) {
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
    const { label, street, city, state, postalCode, country, phone, isDefault } = body

    // Validate required fields
    if (!label || !street || !city || !country) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', sessionResult.session.customer_id)
    }

    // Create address
    const { data, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: sessionResult.session.customer_id,
        label: label.trim(),
        street: street.trim(),
        city: city.trim(),
        state: state?.trim() || null,
        postal_code: postalCode?.trim() || null,
        country: country.trim(),
        phone: phone?.trim() || null,
        is_default: isDefault || false
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create address' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      address: data,
      message: 'Address added successfully'
    })

  } catch (error) {
    console.error('Create address error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

// PUT update address
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
    const { id, label, street, city, state, postalCode, country, phone, isDefault } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Address ID is required' },
        { status: 400 }
      )
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', sessionResult.session.customer_id)
    }

    // Update address
    const { data, error } = await supabase
      .from('user_addresses')
      .update({
        label: label?.trim(),
        street: street?.trim(),
        city: city?.trim(),
        state: state?.trim() || null,
        postal_code: postalCode?.trim() || null,
        country: country?.trim(),
        phone: phone?.trim() || null,
        is_default: isDefault || false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', sessionResult.session.customer_id) // Ensure user owns this address
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update address' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      address: data,
      message: 'Address updated successfully'
    })

  } catch (error) {
    console.error('Update address error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

// DELETE address
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Address ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', sessionResult.session.customer_id) // Ensure user owns this address

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete address' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })

  } catch (error) {
    console.error('Delete address error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
