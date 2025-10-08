export interface User {
  id: string
  name: string
  email: string
  phone?: string
  isVerified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: string
  lastLogin?: string
}

export interface RegisterData {
  name: string
  email: string
  phone?: string
  password: string
  address?: string
}

export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
  error?: string
}

export interface OTPRequest {
  email: string
  type: 'email' | 'phone' | 'password_reset'
}

export interface OTPVerification {
  email: string
  code: string
  type: 'email' | 'phone' | 'password_reset'
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  email: string
  code: string
  newPassword: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginData) => Promise<AuthResponse>
  register: (data: RegisterData) => Promise<AuthResponse>
  logout: () => Promise<void>
  verifyOTP: (data: OTPVerification) => Promise<AuthResponse>
  sendOTP: (data: OTPRequest) => Promise<{ success: boolean; message?: string }>
  resetPassword: (data: PasswordReset) => Promise<AuthResponse>
  refreshUser: () => Promise<void>
}
