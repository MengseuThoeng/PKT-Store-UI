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
  private readonly accessToken: string

  constructor() {
    const token = process.env.BAKONG_ACCESS_TOKEN
    if (!token) {
      console.warn('⚠️ BAKONG_ACCESS_TOKEN not set - verification will not work')
      this.accessToken = ''
    } else {
      this.accessToken = token
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
      console.log('🌐 API URL:', this.apiUrl)

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ md5 }),
      })

      console.log('📡 Bakong API Response Status:', response.status)
      
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
