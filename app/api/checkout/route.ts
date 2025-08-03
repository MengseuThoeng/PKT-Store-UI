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
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .invoice {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin: -40px -40px 30px -40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: bold;
        }
        .order-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        .info-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #ec4899;
        }
        .info-section h3 {
            margin: 0 0 15px 0;
            color: #1f2937;
            font-size: 1.2em;
        }
        .info-section p {
            margin: 5px 0;
            color: #6b7280;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .items-table th {
            background: #374151;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        .items-table td {
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
        }
        .items-table tr:nth-child(even) {
            background: #f9fafb;
        }
        .totals {
            background: #f8fafc;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 5px 0;
        }
        .total-row.final {
            border-top: 2px solid #ec4899;
            padding-top: 15px;
            font-size: 1.3em;
            font-weight: bold;
            color: #ec4899;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f1f5f9;
            border-radius: 10px;
            color: #64748b;
        }
        .anime-decoration {
            text-align: center;
            font-size: 2em;
            margin: 20px 0;
        }
        @media print {
            body { background: white; }
            .invoice { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="header">
            <h1>🎌 PKT STORE</h1>
            <p>Premium Anime Figures, Manga & Plushies</p>
            <h2>Invoice #${order.orderNumber}</h2>
        </div>

        <div class="order-info">
            <div class="info-section">
                <h3>👤 Customer Information</h3>
                <p><strong>Name:</strong> ${order.customer.name}</p>
                <p><strong>Phone:</strong> ${order.customer.phone}</p>
                <p><strong>Email:</strong> ${order.customer.email}</p>
                <p><strong>Telegram:</strong> ${order.customer.telegramUsername}</p>
                <p><strong>Address:</strong> ${order.customer.address}</p>
            </div>
            
            <div class="info-section">
                <h3>📋 Order Details</h3>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod.label}</p>
                <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                <tr>
                    <td><strong>${item.name}</strong>${item.series ? `<br><small>Series: ${item.series}</small>` : ''}</td>
                    <td><span style="background: #ec4899; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">${item.type.toUpperCase()}</span></td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>$${order.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Shipping:</span>
                <span style="color: #059669;">FREE</span>
            </div>
            <div class="total-row">
                <span>Tax (8%):</span>
                <span>$${order.tax.toFixed(2)}</span>
            </div>
            <div class="total-row final">
                <span>TOTAL:</span>
                <span>$${order.total.toFixed(2)}</span>
            </div>
        </div>

        <div class="anime-decoration">
            🎌 ⚡ 🎯 ⭐ 🔥
        </div>

        <div class="footer">
            <p><strong>Thank you for shopping with PKT Store!</strong></p>
            <p>For any questions, contact us via Telegram or email</p>
            <p>🛍️ Bringing your favorite anime to life! 🛍️</p>
            <p style="margin-top: 15px; font-size: 0.9em;">
                Generated on ${new Date().toLocaleString()}
            </p>
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
            a.download = 'invoice-${order.orderNumber}.html';
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
