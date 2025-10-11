/**
 * Bakong Payment Verification Service
 * Uses official Bakong API to verify KHQR payments
 * API Docs: https://api-bakong.nbc.gov.kh/document
 */

export interface BakongVerificationResult {
  success: boolean
  status: 'completed' | 'pending' | 'failed'
  data?: {
    hash: string
    fromAccountId: string
    toAccountId: string
    amount: number
    currency: string
    createdDateMs: number
    acknowledgedDateMs: number
  }
  message?: string
  error?: string
}

export class BakongVerifyService {
  private readonly apiUrl = 'https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5'
  private readonly accessToken: string = ''

  constructor() {
    const token = process.env.BAKONG_ACCESS_TOKEN
    if (!token) {
      console.error('❌ BAKONG_ACCESS_TOKEN is not configured!')
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('BAKONG')))
    } else {
      // 🔥 Trim whitespace and newlines that might be added when copying to Vercel
      this.accessToken = token.trim()
      console.log('✅ BAKONG_ACCESS_TOKEN is set (length:', this.accessToken.length, ')')
      console.log('🔍 Token before trim length:', token.length)
      console.log('🔍 Token after trim length:', this.accessToken.length)
      // console.log('🔑 FULL ACCESS TOKEN:', this.accessToken) // 🔥 Debug: Output full token
      if (token !== this.accessToken) {
        console.warn('⚠️ Token had whitespace/newlines! Trimmed.')
      }
    }
  }

  async checkTransactionByMD5(md5: string): Promise<BakongVerificationResult> {
    try {
      if (!this.accessToken) {
        console.error('❌ BAKONG_ACCESS_TOKEN is not configured!')
        return {
          success: false,
          status: 'pending',
          error: 'Bakong access token not configured',
        }
      }

      console.log('📡 Checking Bakong transaction with MD5:', md5)
      console.log('🔑 Access Token (first 20 chars):', this.accessToken.substring(0, 20) + '...')
      console.log('🔑 Access Token (last 20 chars):', '...' + this.accessToken.substring(this.accessToken.length - 20))
      console.log('🔑 Full Token Length:', this.accessToken.length)
      console.log('🌐 API URL:', this.apiUrl)
      console.log('📦 Request Body:', JSON.stringify({ md5 }))
      console.log('📡 Request Headers:', {
        'Authorization': `Bearer ${this.accessToken.substring(0, 20)}...`,
        'Content-Type': 'application/json',
      })

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ md5 }),
      })

      console.log('📡 Bakong API Response Status:', response.status)
      console.log('📡 Bakong API Response Headers:', Object.fromEntries(response.headers.entries()))
      
      // 🔥 Log response status for debugging
      if (!response.ok) {
        console.error('❌ Bakong API returned non-OK status:', response.status, response.statusText)
      }
      
      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type')
      console.log('📄 Content-Type:', contentType)
      
      if (contentType && contentType.includes('text/html')) {
        console.error('❌ Bakong returned HTML instead of JSON!')
        const htmlText = await response.text()
        console.error('HTML Response (full text):', htmlText)
        console.error('This usually means:')
        console.error('  1. IP address is blocked/not whitelisted')
        console.error('  2. WAF/Firewall blocking cloud hosting IPs')
        console.error('  3. Geographic restrictions')
        return {
          success: false,
          status: 'pending',
          error: 'bakong_api_error',
          message: `Bakong API returned HTML error (Status ${response.status}). Possible IP blocking. Check if Vercel IPs are whitelisted with Bakong.`,
        }
      }
      
      const data = await response.json()

      console.log('📦 Bakong Response Data:', {
        responseCode: data.responseCode,
        responseMessage: data.responseMessage,
        errorCode: data.errorCode,
        hasData: !!data.data,
        fullResponse: JSON.stringify(data, null, 2)
      })

      // responseCode: 0 = success, 1 = failed/not found
      if (data.responseCode === 0 && data.data) {
        console.log('✅ Payment confirmed by Bakong!')
        console.log('💰 Amount:', data.data.amount, data.data.currency)
        console.log('👤 From:', data.data.fromAccountId)
        console.log('👤 To:', data.data.toAccountId)

        return {
          success: true,
          status: 'completed',
          data: {
            hash: data.data.hash,
            fromAccountId: data.data.fromAccountId,
            toAccountId: data.data.toAccountId,
            amount: parseFloat(data.data.amount),
            currency: data.data.currency,
            createdDateMs: data.data.createdDateMs,
            acknowledgedDateMs: data.data.acknowledgedDateMs,
          },
        }
      }

      // Error code 2 = Static QR code (Individual accounts)
      if (data.errorCode === 2) {
        console.log('⚠️ Individual KHQR accounts cannot be auto-verified via API')
        console.log('💡 This is normal for personal accounts - requires manual verification')
        console.log('📱 Error Code 2 = Static QR (Individual Account)')
        return {
          success: false,
          status: 'pending',
          message: 'Individual KHQR accounts require manual verification. Please check your banking app.',
          error: 'static_qr_not_supported',
        }
      }

      // Transaction not found or failed
      if (data.errorCode === 1) {
        console.log('⏳ Transaction not found yet - still pending')
        console.log('📱 Error Code 1 = Transaction not found')
        return {
          success: false,
          status: 'pending',
          message: 'Transaction not found - payment may not have been made yet',
        }
      }

      if (data.errorCode === 3) {
        console.log('❌ Transaction failed')
        console.log('📱 Error Code 3 = Transaction failed')
        return {
          success: false,
          status: 'failed',
          message: data.responseMessage || 'Transaction failed',
        }
      }

      console.log('⚠️ Unexpected Bakong response:', data)
      return {
        success: false,
        status: 'pending',
        message: data.responseMessage || 'Unknown status',
      }
    } catch (error) {
      console.error('❌ Bakong verification error:', error)
      return {
        success: false,
        status: 'pending',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

export const bakongVerifyService = new BakongVerifyService()
