import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import { verifySession } from '@/lib/utils/auth';
import { cookies } from 'next/headers';

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessionResult = await verifySession(token);
    if (!sessionResult.success || !sessionResult.session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const customerId = sessionResult.session.customer_id;
    const body = await request.json();
    const { confirmPassword } = body;

    if (!confirmPassword) {
      return NextResponse.json(
        { error: 'Password confirmation required' },
        { status: 400 }
      );
    }

    // Verify password before deletion
    const { data: customer, error: fetchError } = await supabase
      .from('customers')
      .select('password_hash')
      .eq('id', customerId)
      .single();

    if (fetchError || !customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Verify password
    const bcrypt = await import('bcryptjs');
    const passwordMatch = await bcrypt.compare(confirmPassword, customer.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 400 }
      );
    }

    // Soft delete: Mark account as deleted instead of actually deleting
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        email: `deleted_${customerId}@pktstore.com`, // Prevent email reuse
      })
      .eq('id', customerId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      );
    }

    // Delete all sessions
    await supabase
      .from('user_sessions')
      .delete()
      .eq('customer_id', customerId);

    // Clear auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });

    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
