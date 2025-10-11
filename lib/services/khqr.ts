/**
 * Bakong KHQR Payment Service
 * Using ts-khqr npm package for generating KHQR codes
 * Documentation: https://www.npmjs.com/package/ts-khqr
 */

import { KHQR, CURRENCY, TAG } from 'ts-khqr'

export interface KHQRGenerateParams {
  amount: number
  currency?: 'USD' | 'KHR'
  billNumber?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  items?: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export interface KHQRResponse {
  success: boolean
  qrCode?: string // The KHQR string
  data?: {
    qr: string
    md5: string
  }
  error?: string
}

export class KHQRService {
  private bakongAccountId: string
  private accountName: string
  private accountCity: string

  constructor() {
    // Get configuration from environment variables
    this.bakongAccountId = process.env.BAKONG_ACCOUNT_ID || ''
    this.accountName = process.env.BAKONG_MERCHANT_NAME || 'PKT Store'
    this.accountCity = process.env.BAKONG_MERCHANT_CITY || 'Phnom Penh'

    if (!this.bakongAccountId) {
      console.warn('⚠️ BAKONG_ACCOUNT_ID not set in environment variables')
    }
  }

  /**
   * Generate KHQR Code for payment (Individual Account)
   */
  async generateKHQR(params: KHQRGenerateParams): Promise<KHQRResponse> {
    try {
      console.log('🔧 Generating Individual KHQR with ts-khqr...')
      console.log('📋 Params:', {
        amount: params.amount,
        currency: params.currency,
        billNumber: params.billNumber,
        customerName: params.customerName,
      })

      // Validate required fields
      if (!this.bakongAccountId) {
        throw new Error('Bakong Account ID is not configured')
      }

      if (!params.amount || params.amount <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      // Determine currency
      const currency = params.currency === 'KHR' ? CURRENCY.KHR : CURRENCY.USD

      // Calculate expiration (15 minutes from now)
      const expirationTimestamp = Date.now() + (15 * 60 * 1000)

      // Generate truly unique bill number with timestamp + random
      const uniqueBillNumber = params.billNumber 
        ? `${params.billNumber}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
        : `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`

      console.log('🔢 Generated unique bill number:', uniqueBillNumber)

      // Prepare payload for ts-khqr
      const payload = {
        tag: TAG.INDIVIDUAL,
        accountID: this.bakongAccountId,
        merchantName: this.accountName,
        merchantCity: this.accountCity,
        currency: currency,
        amount: params.amount,
        acquiringBank: 'ACLEDA BANK',
        mobileNumber: params.customerPhone?.replace(/[^0-9]/g, ''),
        billNumber: uniqueBillNumber,
        storeLabel: this.accountName,
        terminalLabel: 'Online Store',
        expirationTimestamp: expirationTimestamp,
      }

      console.log('👤 Individual Account Payload:', payload)

      // Generate KHQR using ts-khqr
      const result = KHQR.generate(payload)

      if (!result.data || !result.data.qr) {
        throw new Error('Failed to generate KHQR')
      }

      const qrCode = result.data.qr
      const md5Hash = result.data.md5

      console.log('✅ KHQR Generated Successfully!')
      console.log('📱 QR Code:', qrCode)
      console.log('🔐 MD5:', md5Hash)

      // Verify the generated KHQR
      const isValid = KHQR.verify(qrCode).isValid
      console.log('✓ KHQR Valid:', isValid)

      return {
        success: true,
        qrCode: qrCode,
        data: {
          qr: qrCode,
          md5: md5Hash,
        },
      }
    } catch (error) {
      console.error('❌ KHQR Generation Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate KHQR',
      }
    }
  }

  /**
   * Verify KHQR Code
   */
  verifyKHQR(qrString: string): boolean {
    try {
      const result = KHQR.verify(qrString)
      return result.isValid
    } catch (error) {
      console.error('❌ KHQR Verification Error:', error)
      return false
    }
  }

  /**
   * Decode KHQR Code (decode method not available in ts-khqr)
   */
  decodeKHQR(qrString: string) {
    try {
      // ts-khqr doesn't have decode, use verify instead
      const result = KHQR.verify(qrString)
      return result.isValid ? { valid: true } : null
    } catch (error) {
      console.error('❌ KHQR Decode Error:', error)
      return null
    }
  }

  /**
   * Check Bakong Account (not available in ts-khqr)
   */
  async checkBakongAccount(accountId: string): Promise<any> {
    console.warn('⚠️ checkBakongAccount not available in ts-khqr package')
    return null
  }
}

// Export singleton instance
export const khqrService = new KHQRService()
