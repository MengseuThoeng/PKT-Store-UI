'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/context/CartContext'
import QRCode from 'qrcode'
import { ArrowLeft, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'

export default function KHQRPaymentPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [qrCodeImage, setQrCodeImage] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [transactionId, setTransactionId] = useState<string>('')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending')
  const [timeLeft, setTimeLeft] = useState(3 * 60) // 3 minutes
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null)
  const isMounted = useRef(true)

  // Calculate total price
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  useEffect(() => {
    // Set mounted flag
    isMounted.current = true

    // Generate QR code on page load
    generateQRCode()

    return () => {
      // Cleanup interval on unmount
      // console.log('🧹 Cleaning up KHQR payment page...')
      isMounted.current = false
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current)
        statusCheckInterval.current = null
      }
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setError('QR code has expired. Please try again.')
      setLoading(false)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const generateQRCode = async () => {
    try {
      setLoading(true)
      setError('')

      // Get customer info from localStorage
      const customerName = localStorage.getItem('customerName') || 'Customer'
      const customerEmail = localStorage.getItem('customerEmail') || ''
      const customerPhone = localStorage.getItem('customerPhone') || ''
      const customerAddress = localStorage.getItem('customerAddress') || ''

      // Calculate total
      const total = getTotalPrice()

      if (items.length === 0) {
        setError('Cart is empty')
        setLoading(false)
        return
      }

      // console.log('🔧 Generating KHQR for amount:', total)

      // Call API to generate KHQR
      const response = await fetch('/api/payment/khqr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include auth cookies
        body: JSON.stringify({
          amount: total,
          currency: 'USD',
          billNumber: `ORDER-${Date.now()}`,
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate QR code')
      }

      // console.log('✅ KHQR Generated:', data.md5)

      // Generate QR code image from string
      const qrImage = await QRCode.toDataURL(data.qrCode, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })

      setQrCodeImage(qrImage)
      setTransactionId(data.transactionId)
      setLoading(false)

      // Start checking payment status every 5 seconds
      statusCheckInterval.current = setInterval(() => {
        checkPaymentStatus(data.transactionId)
      }, 5000)
    } catch (err) {
      console.error('❌ QR Generation Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate QR code')
      setLoading(false)
    }
  }

  const checkPaymentStatus = async (txnId: string) => {
    try {
      // Don't make request if component is unmounted
      if (!isMounted.current) {
        // console.log('⚠️ Component unmounted, stopping checks')
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current)
          statusCheckInterval.current = null
        }
        return
      }

      console.log('🔍 Checking payment status for transaction:', txnId)
      const response = await fetch(`/api/payment/khqr?transactionId=${txnId}`)
      
      console.log('📡 Response status:', response.status)
      
      // If transaction not found (404), stop checking
      if (response.status === 404) {
        console.warn('⚠️ Transaction not found, stopping status checks')
        alert('❌ DEBUG: Transaction not found (404). Transaction ID: ' + txnId)
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current)
          statusCheckInterval.current = null
        }
        return
      }
      
      const data = await response.json()
      
      // 🔥 DEBUG ALERT - Show what we got from API
      console.log('📦 Payment check response:', data)
      alert(`🔍 DEBUG - Payment Status Check:\n\n` +
        `Transaction ID: ${txnId}\n` +
        `MD5 Hash: ${data.transaction?.md5 || data.md5 || 'NOT FOUND'}\n` +
        `Success: ${data.success}\n` +
        `Status: ${data.status}\n` +
        `Message: ${data.message || 'N/A'}\n` +
        `Error: ${data.error || 'N/A'}\n` +
        `Bakong Error: ${data.bakongError || 'N/A'}\n` +
        `Bakong Message: ${data.bakongMessage || 'N/A'}\n` +
        `Has Bakong Data: ${!!data.bakongData}\n\n` +
        `🔍 EXPLANATION:\n` +
        (data.bakongError === 'static_qr_not_supported' 
          ? '⚠️ Individual KHQR account detected!\nBakong API cannot auto-verify personal accounts.\nOnly merchant accounts support auto-verification.\n\n' 
          : '') +
        (data.message?.includes('not found')
          ? '⏳ Payment not detected by Bakong yet.\nEither you haven\'t paid, or Bakong is slow.\n\n'
          : '') +
        `Full Response: ${JSON.stringify(data, null, 2)}`)

      // Check if still mounted before updating state
      if (!isMounted.current) {
        console.log('⚠️ Component unmounted during request, ignoring response')
        return
      }

      if (data.success && data.status === 'completed') {
        console.log('✅ Payment confirmed! Order created automatically on server.')
        alert('✅ SUCCESS! Payment confirmed by Bakong API. Redirecting to orders...')
        setPaymentStatus('success')
        
        // Clear interval IMMEDIATELY
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current)
          statusCheckInterval.current = null
          console.log('🛑 Status check interval stopped')
        }

        // Order is already created automatically by the payment verification API
        // No need to call /api/orders/create anymore!
        console.log('📦 Order was auto-created by payment verification')

        // Clear cart
        clearCart()

        // Redirect to success page after 1 second
        setTimeout(() => {
          router.push('/orders?payment=success')
        }, 1000)
      } else if (data.status === 'failed') {
        console.log('❌ Payment failed! Stopping checks...')
        alert('❌ Payment verification FAILED! Reason: ' + (data.error || data.message || 'Unknown'))
        setPaymentStatus('failed')
        setError('Payment failed. Please try again.')
        
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current)
          statusCheckInterval.current = null
          console.log('🛑 Status check interval stopped')
        }
      } else {
        // Still pending
        console.log('⏳ Payment still pending...')
        alert(`⏳ Still PENDING...\nStatus: ${data.status}\nMessage: ${data.message || 'Waiting for payment'}`)
      }
    } catch (err) {
      console.error('❌ Status Check Error:', err)
      alert('❌ ERROR checking payment status:\n' + (err instanceof Error ? err.message : String(err)))
      // Don't stop interval on network errors, keep trying
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating QR code...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
            >
              Go Back
            </button>
          </div>
        ) : paymentStatus === 'success' ? (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Redirecting to orders page...</p>
          </div>
        ) : (
          <>
            {/* KHQR Card - Styled like the image */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Red Header with KHQR Logo */}
              <div className="bg-gradient-to-r from-red-600 to-red-500 py-6 text-center">
                <h1 className="text-white text-4xl font-bold tracking-wider">KHQR</h1>
              </div>

              {/* White Content Area */}
              <div className="bg-white p-8">
                {/* Merchant Name */}
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-sm mb-1">PKT Store</p>
                  
                  {/* Amount Display */}
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900">
                      {getTotalPrice().toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                    <span className="text-2xl font-semibold text-gray-600">
                      {items[0]?.price && getTotalPrice() >= 1 ? 'KHR' : 'USD'}
                    </span>
                  </div>
                </div>

                {/* Dashed Line Separator */}
                <div className="border-t-2 border-dashed border-gray-300 my-6"></div>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                  {qrCodeImage && (
                    <div className="relative">
                      <img 
                        src={qrCodeImage} 
                        alt="KHQR Code" 
                        className="w-72 h-72 rounded-lg"
                      />
                      {/* Center Dollar Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                          {/* DOLLAR */}
                          <span className="text-2xl"><strong>$</strong></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 mt-6 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Expires in: {formatTime(timeLeft)}
              </span>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-4">
              <h3 className="font-bold text-gray-800 mb-3 text-center">How to pay</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Open your banking app (ABA, ACLEDA, Wing, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Find the KHQR or QR scan option</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Scan the QR code above</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Confirm the payment in your banking app</span>
                </li>
              </ol>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="font-bold text-gray-800 mb-4 text-center">Order Summary</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm pb-3 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600">
                      {item.name} <span className="text-gray-400">×{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-red-500">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Waiting for payment confirmation...</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Supported Banks */}
      {!loading && !error && paymentStatus === 'pending' && (
        <div className="max-w-md mx-auto mt-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Supported by all Cambodian banks:</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <span className="text-xs bg-white px-4 py-2 rounded-full shadow-sm font-medium">ABA</span>
            <span className="text-xs bg-white px-4 py-2 rounded-full shadow-sm font-medium">ACLEDA</span>
            <span className="text-xs bg-white px-4 py-2 rounded-full shadow-sm font-medium">Wing</span>
            <span className="text-xs bg-white px-4 py-2 rounded-full shadow-sm font-medium">TrueMoney</span>
            <span className="text-xs bg-white px-4 py-2 rounded-full shadow-sm font-medium">Pi Pay</span>
            <span className="text-xs bg-white px-4 py-2 rounded-full shadow-sm font-medium">& More</span>
          </div>
        </div>
      )}
    </div>
  )
}
