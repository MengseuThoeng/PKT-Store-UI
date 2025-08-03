"use client"
import { useState } from 'react'
import { X, User, Phone, Mail, MessageCircle, MapPin, CreditCard, Truck, Check } from 'lucide-react'
import { useCart } from '@/lib/context/CartContext'
import type { CustomerInfo, PaymentMethod, CheckoutFormData } from '@/lib/types/order'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CheckoutFormData) => void
}

const paymentMethods: PaymentMethod[] = [
  {
    type: 'ABA',
    label: 'ABA Bank',
    icon: '🏦',
    description: 'Transfer to ABA account'
  },
  {
    type: 'ACLEDA',
    label: 'ACLEDA Bank',
    icon: '🏛️',
    description: 'Transfer to ACLEDA account'
  },
  {
    type: 'WING',
    label: 'WING',
    icon: '📱',
    description: 'Mobile payment via WING'
  },
  {
    type: 'COD',
    label: 'Cash on Delivery',
    icon: '💵',
    description: 'Pay when you receive'
  }
]

export default function CheckoutModal({ isOpen, onClose, onSubmit }: CheckoutModalProps) {
  const { items, totalItems, totalPrice } = useCart()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    telegramUsername: '',
    address: ''
  })
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)

  if (!isOpen) return null

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
      await onSubmit({
        customer: customerInfo,
        paymentMethod: selectedPayment
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Checkout</h2>
          <p className="text-pink-100 mt-1">{totalItems} items • ${(totalPrice * 1.08).toFixed(2)}</p>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-4 space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-white' : 'text-pink-200'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-white text-pink-500 border-white' : 'border-pink-200'}`}>
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className="ml-2 font-medium">Customer Info</span>
            </div>
            <div className="flex-1 h-px bg-pink-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-white' : 'text-pink-200'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-white text-pink-500 border-white' : 'border-pink-200'}`}>
                {step > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            <div className="flex-1 h-px bg-pink-300"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-white' : 'text-pink-200'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'bg-white text-pink-500 border-white' : 'border-pink-200'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Customer Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
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
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <CreditCard className="w-5 h-5 inline mr-2" />
                  Choose Payment Method
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.type}
                      onClick={() => setSelectedPayment(method)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedPayment?.type === method.type
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{method.label}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {selectedPayment?.type === method.type && (
                          <div className="ml-auto">
                            <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review Order */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Review</h3>
                
                {/* Customer Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Name:</strong> {customerInfo.name}</p>
                    <p><strong>Phone:</strong> {customerInfo.phone}</p>
                    <p><strong>Email:</strong> {customerInfo.email}</p>
                    <p><strong>Telegram:</strong> {customerInfo.telegramUsername}</p>
                    <p><strong>Address:</strong> {customerInfo.address}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{selectedPayment?.icon}</span>
                    <span className="font-medium">{selectedPayment?.label}</span>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${(totalPrice * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-pink-600">${(totalPrice * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            
            <div className="ml-auto">
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
