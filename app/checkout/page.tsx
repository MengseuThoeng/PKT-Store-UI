"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Phone, Mail, MessageCircle, MapPin, CreditCard, Truck, Check, LogIn } from 'lucide-react'
import { useCart } from '@/lib/context/CartContext'
import { useAuth } from '@/lib/context/AuthContext'
import type { CustomerInfo, PaymentMethod, CheckoutFormData } from '@/lib/types/order'

const paymentMethods: PaymentMethod[] = [
  {
    type: 'KHQR',
    label: 'KHQR Payment',
    icon: '📱',
    description: 'Scan & Pay with any bank'
  },
  {
    type: 'COD',
    label: 'Cash on Delivery',
    icon: '💵',
    description: 'Pay when you receive'
  }
]

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    telegramUsername: '',
    address: ''
  })
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const isStep1Valid = () => {
    return customerInfo.name && 
           customerInfo.phone && 
           customerInfo.email && 
           customerInfo.telegramUsername && 
           customerInfo.address
  }

  const isStep2Valid = () => {
    return selectedPayment !== null
  }

  const handleSubmit = async () => {
    if (!selectedPayment) return

    setIsLoading(true)

    try {
      // Save customer info to localStorage
      localStorage.setItem('customerName', customerInfo.name)
      localStorage.setItem('customerEmail', customerInfo.email)
      localStorage.setItem('customerPhone', customerInfo.phone)
      localStorage.setItem('customerTelegram', customerInfo.telegramUsername)
      localStorage.setItem('customerAddress', customerInfo.address)

      // Navigate based on payment method
      if (selectedPayment.type === 'KHQR') {
        router.push('/payment/khqr')
      } else {
        router.push('/payment/cod')
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-600 mt-1">{totalItems} items • ${(totalPrice * 1.08).toFixed(2)}</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-pink-500' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-pink-500 text-white border-pink-500' : 'border-gray-300'}`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className="font-semibold">Customer Info</p>
                <p className="text-xs text-gray-500">Your details</p>
              </div>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-pink-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-pink-500' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-pink-500 text-white border-pink-500' : 'border-gray-300'}`}>
                {step > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className="font-semibold">Payment</p>
                <p className="text-xs text-gray-500">Choose method</p>
              </div>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-pink-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-pink-500' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'bg-pink-500 text-white border-pink-500' : 'border-gray-300'}`}>
                3
              </div>
              <div className="ml-3 hidden sm:block">
                <p className="font-semibold">Review</p>
                <p className="text-xs text-gray-500">Confirm order</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Step 1: Customer Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="+855 12 345 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Telegram Username *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.telegramUsername}
                    onChange={(e) => handleCustomerInfoChange('telegramUsername', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="@yourusername"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Delivery Address *
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Street address, city, postal code..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.type}
                    onClick={() => setSelectedPayment(method)}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      selectedPayment?.type === method.type
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{method.icon}</div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-800">{method.label}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      {selectedPayment?.type === method.type && (
                        <Check className="w-6 h-6 text-pink-500 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Your Order</h2>
              
              {/* Customer Info Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {customerInfo.name}</p>
                  <p><strong>Phone:</strong> {customerInfo.phone}</p>
                  <p><strong>Email:</strong> {customerInfo.email}</p>
                  <p><strong>Telegram:</strong> {customerInfo.telegramUsername}</p>
                  <p><strong>Address:</strong> {customerInfo.address}</p>
                </div>
              </div>

              {/* Payment Method Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedPayment?.icon}</span>
                  <div>
                    <p className="font-medium">{selectedPayment?.label}</p>
                    <p className="text-sm text-gray-600">{selectedPayment?.description}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Order Items ({totalItems})</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8%)</span>
                    <span>${(totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-pink-500">${(totalPrice * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons - Always visible at bottom */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sticky bottom-4">
          <div className="flex justify-between gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            
            <div className={step === 1 ? 'ml-auto' : ''}>
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 ? !isStep1Valid() : !isStep2Valid()}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Place Order
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
