"use client"
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import type { User, AuthContextType, LoginData, RegisterData, OTPVerification, OTPRequest, PasswordReset, AuthResponse } from '@/lib/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionCheckInterval, setSessionCheckInterval] = useState<NodeJS.Timeout | null>(null)

  // Check session on mount and periodically
  useEffect(() => {
    checkSession()

    // Check session every 5 minutes to keep auth fresh
    const interval = setInterval(() => {
      console.log('🔄 Periodic session check...')
      checkSession()
    }, 5 * 60 * 1000) // 5 minutes

    setSessionCheckInterval(interval)

    // Cleanup on unmount
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  // Also check session when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Tab visible - checking session...')
        checkSession()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include', // Important: include cookies
      })
      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        console.log('✅ Session valid:', data.user.email)
      } else {
        setUser(null)
        console.log('❌ Session invalid or expired')
      }
    } catch (error) {
      console.error('❌ Session check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
        credentials: 'include', // Include cookies
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success && result.user) {
        setUser(result.user)
        console.log('✅ Login successful:', result.user.email)
        return { success: true, user: result.user, token: result.token }
      }

      return { success: false, error: result.error }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  async function logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' // Include cookies
      })
      setUser(null)
      console.log('✅ Logout successful')
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
