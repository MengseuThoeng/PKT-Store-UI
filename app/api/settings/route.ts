import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import { verifySession } from '@/lib/utils/auth';
import { cookies } from 'next/headers';

// Get user settings
export async function GET(request: NextRequest) {
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

    // Fetch customer data including preferences
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    // Return settings
    return NextResponse.json({
      success: true,
      settings: {
        emailNotifications: customer.email_notifications ?? true,
        orderUpdates: customer.order_updates ?? true,
        promotionalEmails: customer.promotional_emails ?? false,
        smsNotifications: customer.sms_notifications ?? false,
        newsletter: customer.newsletter ?? false,
        twoFactorAuth: customer.two_factor_enabled ?? false,
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user settings
export async function PUT(request: NextRequest) {
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

    const {
      emailNotifications,
      orderUpdates,
      promotionalEmails,
      smsNotifications,
      newsletter,
      twoFactorAuth,
    } = body;

    // Update settings
    const { error } = await supabase
      .from('customers')
      .update({
        email_notifications: emailNotifications,
        order_updates: orderUpdates,
        promotional_emails: promotionalEmails,
        sms_notifications: smsNotifications,
        newsletter: newsletter,
        two_factor_enabled: twoFactorAuth,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customerId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
