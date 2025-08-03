"use client"
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { CartItem, CartContextType } from '@/lib/types/cart'

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number; type: CartItem['type'] } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; type: CartItem['type']; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartState {
  items: CartItem[]
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = { ...action.payload, quantity: action.payload.quantity || 1 }
      const existingItemIndex = state.items.findIndex(
        item => item.id === newItem.id && item.type === newItem.type
      )

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items]
        const existingItem = updatedItems[existingItemIndex]
        const newQuantity = existingItem.quantity + newItem.quantity
        
        // Don't exceed max stock
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: Math.min(newQuantity, existingItem.maxStock)
        }
        
        return { items: updatedItems }
      } else {
        return { items: [...state.items, newItem] }
      }
    }

    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter(
          item => !(item.id === action.payload.id && item.type === action.payload.type)
        )
      }
    }

    case 'UPDATE_QUANTITY': {
      const { id, type, quantity } = action.payload
      
      if (quantity <= 0) {
        return {
          items: state.items.filter(item => !(item.id === id && item.type === type))
        }
      }

      return {
        items: state.items.map(item =>
          item.id === id && item.type === type
            ? { ...item, quantity: Math.min(quantity, item.maxStock) }
            : item
        )
      }
    }

    case 'CLEAR_CART': {
      return { items: [] }
    }

    case 'LOAD_CART': {
      return { items: action.payload }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pkt-store-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pkt-store-cart', JSON.stringify(state.items))
  }, [state.items])

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: number, type: CartItem['type']) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, type } })
  }

  const updateQuantity = (id: number, type: CartItem['type'], quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, type, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const value: CartContextType = {
    items: state.items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
