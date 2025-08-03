import { NextRequest, NextResponse } from 'next/server'
import type { Order } from '@/lib/types/order'

// In a real app, you'd use a database. For now, we'll simulate with a simple store
// eslint-disable-next-line prefer-const
let orders: Order[] = []

function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `PKT${timestamp}${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, paymentMethod, items, totals } = body

    // Create order
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(),
      customer,
      items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
      telegramSent: false
    }

    // Store order (in real app, save to database)
    orders.push(order)

    // Send Telegram notification
    try {
      await sendTelegramNotification(order)
      order.telegramSent = true
    } catch (telegramError) {
      console.error('Telegram notification failed:', telegramError)
      // Don't fail the order if Telegram fails
    }

    // Generate invoice HTML
    const invoiceHtml = generateInvoiceHtml(order)

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      invoice: invoiceHtml
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    )
  }
}

async function sendTelegramNotification(order: Order) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const groupChatId = process.env.TELEGRAM_GROUP_CHAT_ID
  
  if (!botToken || !groupChatId) {
    console.warn('Telegram bot token or group chat ID not configured')
    return
  }

  // Message for store group
  const groupMessage = `
🛒 <b>NEW ORDER #${order.orderNumber}</b>

👤 <b>Customer:</b> ${order.customer.name}
📱 <b>Phone:</b> ${order.customer.phone}
📧 <b>Email:</b> ${order.customer.email}
💬 <b>Telegram:</b> ${order.customer.telegramUsername}
📍 <b>Address:</b> ${order.customer.address}

💳 <b>Payment:</b> ${order.paymentMethod.label}
💰 <b>Total:</b> $${order.total.toFixed(2)}

📦 <b>Items:</b>
${order.items.map(item => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

⏰ <b>Order Time:</b> ${new Date(order.createdAt).toLocaleString()}
  `.trim()

  // Send to group
  try {
    const groupResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: groupChatId,
        text: groupMessage,
        parse_mode: 'HTML'
      })
    })

    const groupResult = await groupResponse.json()
    if (!groupResult.ok) {
      throw new Error(`Telegram API error: ${groupResult.description}`)
    }
  } catch (error) {
    console.error('Group message error:', error)
    throw error
  }

  // Message for customer
  const customerMessage = `
🎉 <b>Order Confirmed!</b>

Hi ${order.customer.name}! Your order has been received.

📋 <b>Order #${order.orderNumber}</b>
💰 <b>Total:</b> $${order.total.toFixed(2)}
💳 <b>Payment:</b> ${order.paymentMethod.label}

We'll contact you soon to confirm delivery details!

Thank you for shopping with PKT Store! 🛍️
  `.trim()

  // Try to send to customer
  const username = order.customer.telegramUsername.replace('@', '')
  try {
    const customerResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: `@${username}`,
        text: customerMessage,
        parse_mode: 'HTML'
      })
    })

    const customerResult = await customerResponse.json()
    if (!customerResult.ok) {
      console.warn('Could not send to customer (normal if they haven\'t started chat with bot)')
    }
  } catch (error) {
    console.warn('Customer message error (this is normal):', error)
  }
}

function generateInvoiceHtml(order: Order): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #${order.orderNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            padding: 40px 20px;
            color: #333;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 60px;
        }
        
        .invoice-title {
            font-size: 48px;
            font-weight: bold;
            color: #1e3a8a;
            letter-spacing: 2px;
        }
        
        .company-logo {
            font-size: 40px;
            color: #fbbf24;
        }
        
        .billing-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 60px;
        }
        
        .bill-to, .invoice-details {
            flex: 1;
        }
        
        .bill-to {
            margin-right: 40px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .customer-info, .invoice-meta {
            line-height: 1.8;
            color: #555;
        }
        
        .invoice-meta {
            text-align: right;
        }
        
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin: 40px 0;
        }
        
        .invoice-table th {
            background: none;
            border-bottom: 2px solid #e74c3c;
            padding: 15px;
            text-align: left;
            font-weight: bold;
            color: #1e3a8a;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 14px;
        }
        
        .invoice-table th:last-child,
        .invoice-table td:last-child {
            text-align: right;
        }
        
        .invoice-table td {
            padding: 20px 15px;
            border-bottom: 1px solid #eee;
            color: #555;
        }
        
        .invoice-table tr:hover {
            background-color: #f8f9fa;
        }
        
        .totals-section {
            margin-top: 40px;
            text-align: right;
        }
        
        .total-row {
            display: flex;
            justify-content: flex-end;
            margin: 10px 0;
            font-size: 16px;
        }
        
        .total-label {
            width: 150px;
            text-align: right;
            margin-right: 30px;
            color: #555;
        }
        
        .total-amount {
            width: 120px;
            text-align: right;
            font-weight: 500;
        }
        
        .grand-total {
            border-top: 2px solid #e74c3c;
            padding-top: 15px;
            margin-top: 15px;
            font-size: 24px;
            font-weight: bold;
            color: #1e3a8a;
        }
        
        .grand-total .total-label {
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .payment-info {
            margin-top: 40px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #1e3a8a;
        }
        
        .footer {
            margin-top: 60px;
            text-align: center;
            color: #888;
            font-size: 14px;
            line-height: 1.6;
        }
        
        @media print {
            body { 
                background: white; 
                padding: 0;
            }
            .invoice-container { 
                box-shadow: none; 
                padding: 40px;
            }
        }
        
        @media (max-width: 768px) {
            .invoice-container {
                padding: 30px 20px;
            }
            
            .invoice-header {
                flex-direction: column;
                text-align: center;
            }
            
            .invoice-title {
                font-size: 36px;
                margin-bottom: 20px;
            }
            
            .billing-info {
                flex-direction: column;
            }
            
            .bill-to {
                margin-right: 0;
                margin-bottom: 30px;
            }
            
            .invoice-meta {
                text-align: left;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
            <div>
                <div class="invoice-title">INVOICE</div>
                <div style="margin-top: 10px; color: #666; font-size: 14px;">PKT Store</div>
            </div>
            <div class="company-logo">🎌</div>
        </div>

        <!-- Billing Information -->
        <div class="billing-info">
            <div class="bill-to">
                <div class="section-title">Bill To</div>
                <div class="customer-info">
                    <div style="font-weight: 600; margin-bottom: 5px;">${order.customer.name}</div>
                    <div>${order.customer.phone}</div>
                    <div>${order.customer.email}</div>
                    <div>${order.customer.telegramUsername}</div>
                    <div style="margin-top: 10px;">${order.customer.address}</div>
                </div>
            </div>
            
            <div class="invoice-details">
                <div class="invoice-meta">
                    <div style="margin-bottom: 15px;">
                        <span style="color: #1e3a8a; font-weight: bold; font-size: 16px;">Invoice #</span>
                        <div style="font-size: 20px; font-weight: 600; margin-top: 5px;">${order.orderNumber}</div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <span style="color: #1e3a8a; font-weight: bold;">Invoice Date</span>
                        <div style="margin-top: 5px;">${new Date(order.createdAt).toLocaleDateString('en-GB')}</div>
                    </div>
                    <div>
                        <span style="color: #1e3a8a; font-weight: bold;">Due Date</span>
                        <div style="margin-top: 5px;">${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>QTY</th>
                    <th>Description</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                <tr>
                    <td style="font-weight: 600;">${item.quantity}</td>
                    <td>
                        <div style="font-weight: 600; margin-bottom: 5px;">${item.name}</div>
                        ${item.series ? `<div style="font-size: 13px; color: #888;">Series: ${item.series}</div>` : ''}
                        <div style="font-size: 13px; color: #888; text-transform: capitalize;">${item.type}</div>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-section">
            <div class="total-row">
                <div class="total-label">Subtotal</div>
                <div class="total-amount">$${order.subtotal.toFixed(2)}</div>
            </div>
            <div class="total-row">
                <div class="total-label">Shipping</div>
                <div class="total-amount" style="color: #059669;">FREE</div>
            </div>
            <div class="total-row">
                <div class="total-label">Tax (${((order.tax / order.subtotal) * 100).toFixed(1)}%)</div>
                <div class="total-amount">$${order.tax.toFixed(2)}</div>
            </div>
            <div class="total-row grand-total">
                <div class="total-label">Total</div>
                <div class="total-amount">$${order.total.toFixed(2)}</div>
            </div>
        </div>

        <!-- Payment Information -->
        <div class="payment-info">
            <div style="font-weight: bold; color: #1e3a8a; margin-bottom: 10px;">Payment Method</div>
            <div style="font-size: 16px; font-weight: 500;">${order.paymentMethod.label}</div>
            <div style="margin-top: 15px; font-size: 14px; color: #666;">
                Thank you for your business! If you have any questions about this invoice, please contact us.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div style="font-weight: 600; color: #1e3a8a; margin-bottom: 10px;">PKT Store - Premium Anime Merchandise</div>
            <div>Bringing your favorite anime to life! 🎌</div>
            <div style="margin-top: 15px; font-size: 12px;">
                Generated on ${new Date().toLocaleString('en-GB')}
            </div>
        </div>
    </div>

    <script>
        // Auto-download functionality
        function downloadInvoice() {
            const blob = new Blob([document.documentElement.outerHTML], {
                type: 'text/html'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'PKT-Invoice-${order.orderNumber}.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Auto-download after 2 seconds
        setTimeout(downloadInvoice, 2000);
    </script>
</body>
</html>
  `.trim()
}
