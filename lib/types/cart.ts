export interface CartItem {
  id: number
  type: 'figure' | 'manga' | 'plushie'
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  maxStock: number
  series?: string
  character?: string
}

export interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: number, type: CartItem['type']) => void
  updateQuantity: (id: number, type: CartItem['type'], quantity: number) => void
  clearCart: () => void
}
