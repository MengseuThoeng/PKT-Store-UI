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
    } else {
      this.accessToken = token.trim()
      console.log('✅ Bakong service initialized')
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

      console.log('� Verifying payment with MD5:', md5)

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'PKT-Store/1.0',
        },
        body: JSON.stringify({ md5 }),
      })

      console.log('📡 Bakong API Response:', response.status)
      
      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('text/html')) {
        console.error('❌ Bakong API error: IP may be blocked (Status:', response.status, ')')
        return {
          success: false,
          status: 'pending',
          error: 'bakong_api_error',
          message: `Bakong API error. Status: ${response.status}. Possible IP blocking.`,
        }
      }
      
      const data = await response.json()

      // responseCode: 0 = success, 1 = failed/not found
      if (data.responseCode === 0 && data.data) {
        console.log('✅ Payment verified successfully!')
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

      // Handle all Bakong error codes
      switch (data.errorCode) {
        case 1:
          console.log('⏳ Transaction not found yet')
          return {
            success: false,
            status: 'pending',
            message: 'Transaction could not be found. Please try again.',
            error: 'transaction_not_found',
          }

        case 2:
          console.log('⚠️ Static QR code - Individual account')
          return {
            success: false,
            status: 'pending',
            message: 'Individual KHQR accounts require manual verification.',
            error: 'static_qr_not_supported',
          }

        case 3:
          console.log('❌ Transaction failed')
          return {
            success: false,
            status: 'failed',
            message: data.responseMessage || 'Transaction failed',
            error: 'transaction_failed',
          }

        case 4:
          console.error('❌ Deeplink error')
          return {
            success: false,
            status: 'failed',
            message: 'Error occurred on requesting deeplink from provider',
            error: 'deeplink_error',
          }

        case 5:
          console.error('❌ Missing required fields')
          return {
            success: false,
            status: 'failed',
            message: 'Missing required fields',
            error: 'missing_fields',
          }

        case 6:
          console.error('❌ Unauthorized')
          return {
            success: false,
            status: 'failed',
            message: 'Unauthorized - Invalid access token',
            error: 'unauthorized',
          }

        case 7:
          console.error('❌ Email server down')
          return {
            success: false,
            status: 'pending',
            message: 'Email server has been down',
            error: 'email_server_down',
          }

        case 8:
          console.error('❌ Email already registered')
          return {
            success: false,
            status: 'failed',
            message: 'Email has been registered already',
            error: 'email_registered',
          }

        case 9:
          console.error('❌ Cannot connect to server')
          return {
            success: false,
            status: 'pending',
            message: 'Cannot connect to server. Please try again later.',
            error: 'server_connection_error',
          }

        case 10:
          console.error('❌ Not registered')
          return {
            success: false,
            status: 'failed',
            message: 'Not registered yet',
            error: 'not_registered',
          }

        case 11:
          console.error('❌ Account ID not found')
          return {
            success: false,
            status: 'failed',
            message: 'Account ID not found',
            error: 'account_not_found',
          }

        case 12:
          console.error('❌ Invalid Account ID')
          return {
            success: false,
            status: 'failed',
            message: 'Account ID is invalid',
            error: 'invalid_account',
          }

        default:
          console.log('⚠️ Unknown error code:', data.errorCode)
          return {
            success: false,
            status: 'pending',
            message: data.responseMessage || 'Unknown status',
            error: 'unknown_error',
          }
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
