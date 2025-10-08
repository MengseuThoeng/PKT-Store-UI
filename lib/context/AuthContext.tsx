"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, AuthContextType, LoginData, RegisterData, OTPVerification, OTPRequest, PasswordReset, AuthResponse } from '@/lib/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check session on mount
  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Session check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success && result.user) {
        // Don't set user yet - they need to verify email first
        return { success: true, user: result.user, message: result.message }
      }

      return { success: false, error: result.error }
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  async function login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success && result.user) {
        setUser(result.user)
        return { success: true, user: result.user, token: result.token }
      }

      return { success: false, error: result.error }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  async function logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  async function verifyOTP(data: OTPVerification): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success && result.user) {
        // After email verification, user can login
        return { success: true, user: result.user, message: result.message }
      }

      return { success: false, error: result.error }
    } catch (error: any) {
      return { success: false, error: error.message || 'Verification failed' }
    }
  }

  async function sendOTP(data: OTPRequest): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      return result
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to send OTP' }
    }
  }

  async function resetPassword(data: PasswordReset): Promise<AuthResponse> {
    // TODO: Implement password reset
    return { success: false, error: 'Not implemented yet' }
  }

  async function refreshUser(): Promise<void> {
    await checkSession()
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    verifyOTP,
    sendOTP,
    resetPassword,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
