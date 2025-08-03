import type { CartItem } from './cart'

export interface CustomerInfo {
  name: string
  phone: string
  email: string
  telegramUsername: string
  address: string
}

export interface PaymentMethod {
  type: 'ABA' | 'ACLEDA' | 'WING' | 'COD'
  label: string
  icon: string
  description: string
}

export interface Order {
  id: string
  orderNumber: string
  customer: CustomerInfo
  items: CartItem[] // Use CartItem type instead of any
  subtotal: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  status: 'pending' | 'confirmed' | 'processing' | 'delivered'
  createdAt: string
  telegramSent?: boolean
}

export interface CheckoutFormData {
  customer: CustomerInfo
  paymentMethod: PaymentMethod
}
