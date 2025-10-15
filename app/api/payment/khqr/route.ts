import { NextRequest, NextResponse } from 'next/server'
import { khqrService } from '@/lib/services/khqr'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { bakongVerifyService } from '@/lib/services/bakong-verify'
import { telegramService } from '@/lib/services/telegram'
import { getAuthenticatedUser } from '@/lib/utils/get-auth'

/**
 * POST /api/payment/khqr
 * Generate KHQR code for payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      amount,
      currency = 'USD',
      billNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
    } = body

    console.log('📥 KHQR Payment Request:', {
      amount,
      currency,
      customerName,
      billNumber,
    })

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Generate KHQR
    const result = await khqrService.generateKHQR({
      amount,
      currency,
      billNumber,
      customerName,
      customerEmail,
      customerPhone,
      items,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate KHQR' },
        { status: 500 }
      )
    }

    // Save transaction to database
    const supabase = createServerSupabaseClient()
    
    // Get authenticated user info (customer_id and user_id)
    const authInfo = await getAuthenticatedUser()
    const userId = authInfo.userId
    const customerId = authInfo.customerId
    
    if (authInfo.authenticated) {
      console.log('✅ Authenticated - Customer ID:', customerId, 'User ID:', userId)
    } else {
      console.log('⚠️ Not authenticated - guest checkout')
    }

    const md5Hash = result.data?.md5

    // Create new transaction (MD5 is now unique every time)
    const { data: transaction, error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        transaction_id: md5Hash || `khqr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount,
        currency,
        status: 'pending',
        payment_method: 'KHQR',
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        metadata: {
          qr_code: result.qrCode,
          md5: md5Hash,
          bill_number: billNumber,
          customer_address: customerAddress,
          items,
        },
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ Database Error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      )
    }

    console.log('✅ Transaction saved to database:', transaction.id)
    console.log('🔐 MD5:', md5Hash)

    console.log('✅ Transaction saved to database:', transaction.id)
    console.log('🔐 MD5:', md5Hash)

    return NextResponse.json({
      success: true,
      qrCode: result.qrCode,
      md5: result.data?.md5,
      transactionId: transaction?.id || result.data?.md5,
    })
  } catch (error) {
    console.error('❌ KHQR API Error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payment/khqr?transactionId=xxx
 * Check payment status by verifying with Bakong API
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    // Get transaction from database - search by id OR transaction_id (MD5)
    const supabase = createServerSupabaseClient()
    
    // Try to find by UUID id first
    let { data: transaction, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .maybeSingle()

    // If not found by id, try by transaction_id (MD5)
    if (!transaction) {
      const result = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('transaction_id', transactionId)
        .maybeSingle()
      
      transaction = result.data
      error = result.error
    }

    if (error || !transaction) {
      console.error('❌ Transaction not found:', transactionId)
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    console.log('✅ Found transaction:', transaction.id, 'Status:', transaction.status)

    // If already completed, return immediately
    if (transaction.status === 'completed') {
      console.log('✅ Transaction already completed:', transactionId)
      return NextResponse.json({
        success: true,
        status: 'completed',
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          createdAt: transaction.created_at,
          updatedAt: transaction.updated_at,
        },
      })
    }

    // Get MD5 from metadata
    const md5 = transaction.metadata?.md5 || transaction.transaction_id

    if (!md5) {
      console.error('❌ No MD5 hash found for transaction:', transactionId)
      return NextResponse.json({
        success: true,
        status: transaction.status,
        md5: 'NOT_FOUND', // 🔥 Debug info
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          createdAt: transaction.created_at,
          updatedAt: transaction.updated_at,
        },
      })
    }

    console.log('🔍 Verifying payment with Bakong API, MD5:', md5)

    // Check with Bakong API
    const verification = await bakongVerifyService.checkTransactionByMD5(md5)

    console.log('📋 Verification result:', {
      success: verification.success,
      status: verification.status,
      message: verification.message,
      error: verification.error,
      hasData: !!verification.data,
    })

    // 🔥 Log detailed verification for production debugging
    if (!verification.success) {
      console.log('⚠️ Bakong verification not successful:', {
        status: verification.status,
        message: verification.message,
        error: verification.error,
      })
    }

    // Update database if payment is completed
    if (verification.success && verification.status === 'completed') {
      console.log('✅ Payment confirmed! Updating database...')
      
      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString(),
          metadata: {
            ...transaction.metadata,
            bakong_verification: verification.data,
            verified_at: new Date().toISOString(),
          },
        })
        .eq('id', transaction.id)

      if (updateError) {
        console.error('❌ Failed to update transaction:', updateError)
      } else {
        console.log('✅ Transaction updated to completed')
        
        // 🔥 AUTO-CREATE ORDER IMMEDIATELY!
        try {
          console.log('📦 Auto-creating order for transaction:', transaction.id)
          
          // Check if order already exists
          const { data: existingOrder } = await supabase
            .from('orders')
            .select('id, order_number')
            .eq('payment_id', transaction.id)
            .maybeSingle()
          
          if (existingOrder) {
            console.log('✅ Order already exists:', existingOrder.order_number)
          } else {
            // Create order automatically
            const metadata = transaction.metadata as any || {}
            const items = metadata.items || []
            
            // Get or create customer
            let customerId = null
            
            if (transaction.user_id) {
              // Find customer by user_id
              let { data: customer } = await supabase
                .from('customers')
                .select('id')
                .eq('user_id', transaction.user_id)
                .maybeSingle()
              
              // If not found, create customer
              if (!customer) {
                console.log('📝 Creating customer record for user_id:', transaction.user_id)
                const { data: newCustomer } = await supabase
                  .from('customers')
                  .insert({
                    user_id: transaction.user_id,
                    name: transaction.customer_name,
                    email: transaction.customer_email,
                    phone: transaction.customer_phone || '',
                    address: metadata.customer_address || 'N/A',
                  })
                  .select('id')
                  .single()
                
                customer = newCustomer
              }
              
              customerId = customer?.id
            } else {
              // Guest checkout - create customer without user_id
              console.log('👤 Guest checkout - creating customer record')
              const { data: guestCustomer } = await supabase
                .from('customers')
                .insert({
                  user_id: null,
                  name: transaction.customer_name || 'Guest',
                  email: transaction.customer_email || 'guest@pkt-store.com',
                  phone: transaction.customer_phone || '',
                  address: metadata.customer_address || 'N/A',
                })
                .select('id')
                .single()
              
              customerId = guestCustomer?.id
            }
            
            if (!customerId) {
              console.error('❌ Could not create customer record')
            } else {
              console.log('✅ Customer ID:', customerId)
              // Create order - Only when payment is PAID!
              const orderNumber = `ORD-${Date.now()}`
              const subtotal = parseFloat(transaction.amount)
              
              const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                  order_number: orderNumber,
                  customer_id: customerId,
                  customer_name: transaction.customer_name,
                  customer_email: transaction.customer_email,
                  customer_phone: transaction.customer_phone || '',
                  customer_address: metadata.customer_address || 'N/A',
                  total_amount: subtotal,
                  subtotal: subtotal,
                  shipping_fee: 0,
                  discount: 0,
                  status: 'pending',  // Start with 'pending'
                  payment_method: 'KHQR',
                  payment_status: 'paid',  // KHQR is always paid when order is created
                  payment_id: transaction.id,
                  telegram_sent: false,
                })
                .select()
                .single()
              
              if (orderError) {
                console.error('❌ Failed to create order:', orderError)
              } else {
                console.log('✅ Order created automatically:', order.order_number)
                
                // Create order items
                if (items.length > 0) {
                  const orderItems = items.map((item: any) => ({
                    order_id: order.id,
                    product_id: parseInt(item.id) || 0,
                    product_type: item.type || 'product',
                    product_name: item.name || item.title || 'Product',
                    product_image: item.image || '',
                    quantity: parseInt(item.quantity) || 1,
                    price: parseFloat(item.price) || 0,
                    subtotal: parseFloat(item.price) * (parseInt(item.quantity) || 1),
                  }))
                  
                  const { error: itemsError } = await supabase
                    .from('order_items')
                    .insert(orderItems)
                  
                  if (itemsError) {
                    console.error('⚠️ Failed to create order items:', itemsError)
                  } else {
                    console.log('✅ Order items created:', orderItems.length)
                  }
                }
              }
            }
          }
        } catch (orderCreationError) {
          console.error('❌ Order auto-creation failed:', orderCreationError)
          // Don't fail the payment verification even if order creation fails
        }
        
        // Send Telegram notification for successful payment
        try {
          const metadata = transaction.metadata as any || {}
          const orderItems = metadata.items || []

          await telegramService.sendOrderNotification({
            orderNumber: transaction.transaction_id,
            customerName: transaction.customer_name || 'N/A',
            customerEmail: transaction.customer_email || 'N/A',
            customerPhone: transaction.customer_phone || 'N/A',
            customerAddress: metadata.customer_address || 'N/A',
            totalAmount: parseFloat(transaction.amount),
            paymentMethod: 'KHQR (Auto-Verified)',
            items: orderItems,
            transactionId: transaction.transaction_id,
          })
        } catch (telegramError) {
          console.error('⚠️ Failed to send Telegram notification:', telegramError)
          // Don't fail the request if Telegram fails
        }
      }

      return NextResponse.json({
        success: true,
        status: 'completed',
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: 'completed',
          createdAt: transaction.created_at,
          updatedAt: new Date().toISOString(),
        },
        bakongData: verification.data,
      })
    }

    // Update to failed if verification failed
    if (verification.status === 'failed') {
      console.log('❌ Payment failed! Updating database...')
      
      await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
          metadata: {
            ...transaction.metadata,
            bakong_error: verification.message,
            failed_at: new Date().toISOString(),
          },
        })
        .eq('id', transactionId)

      return NextResponse.json({
        success: false,
        status: 'failed',
        error: verification.message,
      })
    }

    // Still pending
    console.log('⏳ Payment still pending')
    return NextResponse.json({
      success: true,
      status: 'pending',
      md5: md5, // 🔥 Include MD5 for debugging
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        currency: transaction.currency,
        status: 'pending',
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
      },
      message: verification.message,
      bakongError: verification.error, // 🔥 Include Bakong error code
      bakongMessage: verification.message, // 🔥 Include Bakong message
    })
  } catch (error) {
    console.error('❌ Status Check Error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
