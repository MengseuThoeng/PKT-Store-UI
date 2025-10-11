import { Resend } from 'resend'

// Initialize Resend (free tier: 100 emails/day)
const resend = new Resend(process.env.RESEND_API_KEY || 'demo')

// Fallback to nodemailer if Resend key not available
import nodemailer from 'nodemailer'

// Create reusable transporter (fallback)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const USE_RESEND = !!process.env.RESEND_API_KEY

if (!USE_RESEND) {
  console.log('⚠️  Using Gmail SMTP (may have connection issues)')
  console.log('💡 Tip: Get free Resend API key at https://resend.com')
} else {
  console.log('✅ Using Resend for emails')
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Send email using Resend or Gmail SMTP
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    // Try Resend first (more reliable)
    if (USE_RESEND && process.env.RESEND_API_KEY !== 'demo') {
      const { data, error } = await resend.emails.send({
        from: 'PKT Store <onboarding@resend.dev>', // Change to your verified domain
        to,
        subject,
        html,
      })

      if (error) {
        console.error('❌ Resend error:', error)
        throw error
      }

      console.log('✅ Email sent via Resend:', data?.id)
      return { success: true, messageId: data?.id }
    }

    // Fallback to Gmail SMTP
    const info = await transporter.sendMail({
      from: `"PKT Store" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    })

    console.log('✅ Email sent via Gmail:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error('❌ Email send error:', error)
    
    // For development, log the email content instead
    if (process.env.NODE_ENV === 'development') {
      console.log('\n� =============================================')
      console.log('📧 EMAIL IN DEV MODE (Not actually sent)')
      console.log('==============================================')
      console.log('To:', to)
      console.log('Subject:', subject)
      
      // Extract OTP from HTML if present
      const otpMatch = html.match(/class="otp-code">(\d{6})</)
      if (otpMatch) {
        console.log('\n🔑 YOUR OTP CODE:', otpMatch[1])
        console.log('👆 Copy this code to verify your email')
      }
      
      console.log('\n💡 To receive real emails:')
      console.log('   1. Get free Resend API key at https://resend.com')
      console.log('   2. Add RESEND_API_KEY to .env.local')
      console.log('==============================================\n')
      
      // Return success in dev mode for testing
      return { success: true, messageId: 'dev-mode-no-email' }
    }
    
    return { success: false, error: error.message }
  }
}

/**
 * Send OTP verification email
 */
export async function sendOTPEmail(email: string, otp: string, type: 'registration' | 'password_reset' = 'registration') {
  const subject = type === 'registration' ? 'Verify Your Email - PKT Store' : 'Reset Your Password - PKT Store'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: bold;
        }
        .content {
          padding: 40px 30px;
        }
        .otp-box {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 3px dashed #f59e0b;
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 48px;
          font-weight: bold;
          letter-spacing: 10px;
          color: #dc2626;
          font-family: 'Courier New', monospace;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .info-text {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin: 20px 0;
        }
        .footer {
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
        }
        .warning {
          background: #fef2f2;
          border-left: 4px solid #dc2626;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎌 PKT Store</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Anime Figures, Manga & Plushies</p>
        </div>
        <div class="content">
          <h2 style="color: #1f2937; margin-top: 0;">
            ${type === 'registration' ? '✉️ Verify Your Email Address' : '🔐 Reset Your Password'}
          </h2>
          <p style="color: #4b5563; font-size: 16px;">
            ${type === 'registration' 
              ? 'Thank you for registering with PKT Store! Use the code below to verify your email address.' 
              : 'You requested to reset your password. Use the code below to proceed.'}
          </p>
          
          <div class="otp-box">
            <p style="margin: 0 0 10px 0; color: #78350f; font-weight: 600;">Your Verification Code:</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 15px 0 0 0; color: #92400e; font-size: 14px;">⏰ Valid for 5 minutes</p>
          </div>

          <div class="info-text">
            <p><strong>How to use:</strong></p>
            <ol style="padding-left: 20px;">
              <li>Copy the 6-digit code above</li>
              <li>Return to the PKT Store website</li>
              <li>Paste the code in the verification field</li>
              <li>Click "Verify" to complete the process</li>
            </ol>
          </div>

          <div class="warning">
            <p style="margin: 0; color: #991b1b; font-weight: 600;">⚠️ Security Notice:</p>
            <p style="margin: 5px 0 0 0; color: #7f1d1d; font-size: 14px;">
              ${type === 'registration'
                ? 'If you did not create an account, please ignore this email.'
                : 'If you did not request a password reset, please ignore this email or contact support if you have concerns.'}
            </p>
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151;">PKT Store - Your Anime Paradise</p>
          <p style="margin: 0;">📧 Questions? Contact us at ${process.env.GMAIL_USER}</p>
          <p style="margin: 10px 0 0 0; color: #9ca3af;">
            © ${new Date().getFullYear()} PKT Store. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to: email, subject, html })
}

/**
 * Send welcome email after successful registration
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const subject = 'Welcome to PKT Store! 🎌'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
          padding: 50px 20px;
          text-align: center;
          color: white;
        }
        .content {
          padding: 40px 30px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
          color: white;
          padding: 15px 40px;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          margin: 20px 0;
        }
        .features {
          display: grid;
          gap: 20px;
          margin: 30px 0;
        }
        .feature {
          padding: 20px;
          background: #f9fafb;
          border-radius: 10px;
          border-left: 4px solid #ec4899;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="font-size: 48px; margin: 0;">🎉</h1>
          <h2 style="margin: 10px 0;">Welcome to PKT Store!</h2>
          <p>Your anime paradise awaits</p>
        </div>
        <div class="content">
          <h2 style="color: #1f2937;">Hi ${name}! 👋</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            We're thrilled to have you join our community of anime enthusiasts! 
            Your account is now active and you're ready to explore our amazing collection.
          </p>

          <div class="features">
            <div class="feature">
              <h3 style="margin: 0 0 10px 0; color: #ec4899;">🎎 Premium Figures</h3>
              <p style="margin: 0; color: #6b7280;">Discover exclusive anime figures from your favorite series</p>
            </div>
            <div class="feature">
              <h3 style="margin: 0 0 10px 0; color: #ec4899;">📚 Latest Manga</h3>
              <p style="margin: 0; color: #6b7280;">Browse our extensive manga collection</p>
            </div>
            <div class="feature">
              <h3 style="margin: 0 0 10px 0; color: #ec4899;">🧸 Cute Plushies</h3>
              <p style="margin: 0; color: #6b7280;">Find adorable plushies of your favorite characters</p>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">
              Start Shopping Now →
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            💡 <strong>Pro tip:</strong> Follow us on social media for exclusive deals and new arrivals!
          </p>
        </div>
        <div style="background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">Need help? Contact us at ${process.env.GMAIL_USER}</p>
          <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} PKT Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to: email, subject, html })
}

/**
 * Send order confirmation email when admin confirms order
 */
export async function sendOrderConfirmationEmail(
  email: string,
  customerName: string,
  orderDetails: {
    orderNumber: string;
    totalAmount: number;
    customerAddress: string;
    items: Array<{
      product_name: string;
      quantity: number;
      price: number;
    }>;
  }
) {
  const subject = `✅ Order Confirmed - ${orderDetails.orderNumber}`
  
  const itemsHtml = orderDetails.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.product_name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">$${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('')
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .content {
          padding: 40px 30px;
        }
        .status-badge {
          display: inline-block;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 600;
          margin: 20px 0;
        }
        .info-box {
          background: #f0fdf4;
          border-left: 4px solid #10b981;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }
        .order-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .total-row {
          background: #f9fafb;
          font-weight: bold;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="font-size: 48px; margin: 0;">✅</h1>
          <h2 style="margin: 10px 0;">Order Confirmed!</h2>
          <p style="margin: 5px 0;">Your order is being prepared</p>
        </div>
        <div class="content">
          <h2 style="color: #1f2937;">Hi ${customerName}! 👋</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Great news! We've confirmed your order and it's now being prepared for delivery.
          </p>

          <div class="info-box">
            <p style="margin: 0 0 10px 0;"><strong>📦 Order Number:</strong> ${orderDetails.orderNumber}</p>
            <p style="margin: 0 0 10px 0;"><strong>📍 Delivery Address:</strong> ${orderDetails.customerAddress}</p>
            <p style="margin: 0;"><strong>💰 Total Amount:</strong> $${orderDetails.totalAmount.toFixed(2)}</p>
          </div>

          <h3 style="color: #1f2937; margin-top: 30px;">Order Items:</h3>
          <table class="order-table">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 2px solid #e5e7eb;">
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
                <th style="padding: 12px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="3" style="padding: 15px; text-align: right;">Total:</td>
                <td style="padding: 15px; text-align: right; color: #10b981;">$${orderDetails.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">📋 What's Next?</h3>
            <ol style="margin: 10px 0; padding-left: 20px; color: #1e3a8a;">
              <li>Your order is being packed</li>
              <li>We'll notify you when it's out for delivery</li>
              <li>Track your order status anytime in your account</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" 
               style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: 600;">
              Track Order →
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
            💡 Questions? Contact us anytime at ${process.env.GMAIL_USER}
          </p>
        </div>
        <div style="background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">Thank you for shopping with PKT Store! 🎌</p>
          <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} PKT Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to: email, subject, html })
}

