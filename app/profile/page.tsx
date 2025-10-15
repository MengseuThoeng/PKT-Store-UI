"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import AdminGuard from '@/components/ui/AdminGuard'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Save, 
  Edit2, 
  Trash2, 
  Plus,
  Calendar,
  Shield,
  LogOut,
  ChevronRight,
  Home,
  Building2,
  Briefcase
} from 'lucide-react'
import { useToast } from '@/lib/hooks/useToast'
import ToastContainer from '@/components/ui/toast'

interface Address {
  id: string
  label: string
  street: string
  city: string
  state?: string
  postal_code?: string
  country: string
  phone?: string
  is_default: boolean
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout, refreshUser } = useAuth()
  const router = useRouter()
  const { toasts, addToast, removeToast } = useToast()

  // Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    phone: ''
  })

  // Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Cambodia',
    phone: '',
    isDefault: false
  })

  // Loading states
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || ''
      })
      fetchAddresses()
    }
  }, [user, isAuthenticated, router])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/auth/addresses')
      const data = await response.json()

      if (data.success) {
        setAddresses(data.addresses)
      }
    } catch (error) {
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      const data = await response.json()

      if (data.success) {
        addToast('Profile updated successfully!', 'success')
        setIsEditingProfile(false)
        await refreshUser()
      } else {
        addToast(data.error || 'Failed to update profile', 'error')
      }
    } catch (error) {
      addToast('Failed to update profile', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('Passwords do not match', 'error')
      return
    }

    if (passwordData.newPassword.length < 8) {
      addToast('Password must be at least 8 characters', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        addToast('Password changed successfully!', 'success')
        setIsChangingPassword(false)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        addToast(data.error || 'Failed to change password', 'error')
      }
    } catch (error) {
      addToast('Failed to change password', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = editingAddressId ? '/api/auth/addresses' : '/api/auth/addresses'
      const method = editingAddressId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAddressId ? { id: editingAddressId, ...addressForm } : addressForm)
      })

      const data = await response.json()

      if (data.success) {
        addToast(data.message || 'Address saved successfully!', 'success')
        setIsAddingAddress(false)
        setEditingAddressId(null)
        setAddressForm({
          label: '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'Cambodia',
          phone: '',
          isDefault: false
        })
        await fetchAddresses()
      } else {
        addToast(data.error || 'Failed to save address', 'error')
      }
    } catch (error) {
      addToast('Failed to save address', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetch(`/api/auth/addresses?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        addToast('Address deleted successfully', 'success')
        await fetchAddresses()
      } else {
        addToast(data.error || 'Failed to delete address', 'error')
      }
    } catch (error) {
      addToast('Failed to delete address', 'error')
    }
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id)
    setAddressForm({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state || '',
      postalCode: address.postal_code || '',
      country: address.country,
      phone: address.phone || '',
      isDefault: address.is_default
    })
    setIsAddingAddress(true)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const getAddressIcon = (label: string) => {
    const lower = label.toLowerCase()
    if (lower.includes('home')) return Home
    if (lower.includes('office') || lower.includes('work')) return Briefcase
    return Building2
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-12">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                {user.emailVerified && (
                  <span className="inline-flex items-center gap-1 text-sm text-green-600 mt-1">
                    <Shield className="w-4 h-4" />
                    Verified Account
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Info</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  <div>
                    <p className="text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-800">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {user.lastLogin && (
                  <div className="flex items-center gap-3 text-sm">
                    <LogOut className="w-5 h-5 text-pink-500 rotate-180" />
                    <div>
                      <p className="text-gray-500">Last Login</p>
                      <p className="font-medium text-gray-800">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="+855 12 345 678"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false)
                        setProfileData({
                          name: user.name || '',
                          phone: user.phone || ''
                        })
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-800">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-800">{user.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Security</h2>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                )}
              </div>

              {isChangingPassword ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false)
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-600">
                  Keep your account secure by using a strong password and changing it regularly.
                </p>
              )}
            </div>

            {/* Saved Addresses */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Saved Addresses</h2>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Address
                  </button>
                )}
              </div>

              {isAddingAddress && (
                <form onSubmit={handleSaveAddress} className="mb-6 p-4 border border-pink-200 rounded-lg bg-pink-50/50">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    {editingAddressId ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Label (e.g., Home, Office)
                      </label>
                      <input
                        type="text"
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                          className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">Set as default address</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isLoading ? 'Saving...' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAddress(false)
                        setEditingAddressId(null)
                        setAddressForm({
                          label: '',
                          street: '',
                          city: '',
                          state: '',
                          postalCode: '',
                          country: 'Cambodia',
                          phone: '',
                          isDefault: false
                        })
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No saved addresses yet</p>
                ) : (
                  addresses.map((address) => {
                    const Icon = getAddressIcon(address.label)
                    return (
                      <div
                        key={address.id}
                        className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <Icon className="w-5 h-5 text-pink-500 mt-1" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-800">{address.label}</h3>
                              {address.is_default && (
                                <span className="px-2 py-0.5 text-xs bg-pink-100 text-pink-600 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.street}, {address.city}
                              {address.state && `, ${address.state}`}
                              {address.postal_code && ` ${address.postal_code}`}
                            </p>
                            <p className="text-sm text-gray-600">{address.country}</p>
                            {address.phone && (
                              <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </AdminGuard>
  )
}