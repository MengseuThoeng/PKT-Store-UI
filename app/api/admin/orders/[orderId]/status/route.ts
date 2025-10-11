import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/utils/auth';
import { createServerSupabaseClient } from '@/lib/db/supabase';
import { reduceStock, returnStock, checkStockAvailability } from '@/lib/utils/stockManager';
import { sendTelegramMessage } from '@/lib/services/telegram';
import { sendOrderConfirmationEmail } from '@/lib/services/email';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customer = session.session?.customers as any;
    if (!customer?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { status } = await request.json();
    const { orderId } = await params;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: pending, confirmed, processing, completed, or cancelled' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Get current order details and items
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        customers:customer_id (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('id', orderId)
      .single();

    if (fetchError || !currentOrder) {
      console.error('Error fetching order:', fetchError);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch order items' },
        { status: 500 }
      );
    }

    const currentStatus = currentOrder.status;
    let stockMessage = '';

    // Handle stock changes based on status transitions
    if (status === 'confirmed' && currentStatus !== 'confirmed') {
      // REDUCE STOCK when confirming order
      console.log(`📦 Confirming order ${currentOrder.order_number} - checking stock...`);
      
      const stockCheck = await checkStockAvailability(orderItems);
      if (!stockCheck.available) {
        return NextResponse.json(
          { 
            error: 'Insufficient stock', 
            details: stockCheck.insufficientItems 
          },
          { status: 400 }
        );
      }

      const stockResult = await reduceStock(orderItems);
      if (!stockResult.success) {
        return NextResponse.json(
          { error: stockResult.error },
          { status: 500 }
        );
      }

      stockMessage = ' Stock reduced.';
      console.log(`✅ Stock reduced for order ${currentOrder.order_number}`);
    } 
    else if (status === 'cancelled' && currentStatus === 'confirmed') {
      // RETURN STOCK when cancelling a confirmed order
      console.log(`↩️ Cancelling confirmed order ${currentOrder.order_number} - returning stock...`);
      
      const stockResult = await returnStock(orderItems);
      if (!stockResult.success) {
        console.error('Error returning stock:', stockResult.error);
        // Don't fail the cancellation, just log the error
      } else {
        stockMessage = ' Stock returned.';
        console.log(`✅ Stock returned for order ${currentOrder.order_number}`);
      }
    }

    // Update order status
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select(`
        *,
        customers:customer_id (
          id,
          name,
          email,
          phone
        )
      `)
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }

    console.log(`✅ Order ${data.order_number} status updated to: ${status}${stockMessage}`);

    // Send Telegram notification based on status
    try {
      let notificationMessage = '';
      
      if (status === 'confirmed') {
        notificationMessage = `✅ *ORDER CONFIRMED*\n\n` +
          `📦 Order: #${data.order_number}\n` +
          `👤 Customer: ${data.customer_name}\n` +
          `📱 Phone: ${data.customer_phone}\n` +
          `💰 Total: $${data.total_amount}\n` +
          `📍 Address: ${data.customer_address}\n\n` +
          `✨ Order has been confirmed and is being prepared!\n` +
          `📦 Stock has been reserved for this order.`;

        // Send email to customer
        try {
          await sendOrderConfirmationEmail(
            data.customer_email || data.customers?.email,
            data.customer_name,
            {
              orderNumber: data.order_number,
              totalAmount: parseFloat(data.total_amount),
              customerAddress: data.customer_address,
              items: orderItems.map(item => ({
                product_name: item.product_name,
                quantity: item.quantity,
                price: parseFloat(item.price)
              }))
            }
          );
          console.log(`📧 Order confirmation email sent to ${data.customer_email || data.customers?.email}`);
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
          // Don't fail the request if email fails
        }
      } else if (status === 'processing') {
        notificationMessage = `📦 *ORDER PROCESSING*\n\n` +
          `📦 Order: #${data.order_number}\n` +
          `👤 Customer: ${data.customer_name}\n` +
          `📦 Order is being packed and prepared for delivery!`;
      } else if (status === 'completed') {
        notificationMessage = `🎉 *ORDER COMPLETED*\n\n` +
          `📦 Order: #${data.order_number}\n` +
          `👤 Customer: ${data.customer_name}\n` +
          `✅ Order has been successfully delivered!`;
      } else if (status === 'cancelled') {
        notificationMessage = `❌ *ORDER CANCELLED*\n\n` +
          `📦 Order: #${data.order_number}\n` +
          `👤 Customer: ${data.customer_name}\n` +
          `💰 Amount: $${data.total_amount}\n` +
          `❌ Order has been cancelled.${stockMessage ? '\n📦 Stock has been returned.' : ''}`;
      }

      if (notificationMessage) {
        await sendTelegramMessage(notificationMessage);
      }
    } catch (telegramError) {
      console.error('Error sending Telegram notification:', telegramError);
      // Don't fail the request if Telegram fails
    }

    return NextResponse.json({
      success: true,
      order: data,
      message: `Order status updated to ${status}${stockMessage}`,
    });
  } catch (error: any) {
    console.error('Error in update order status API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
