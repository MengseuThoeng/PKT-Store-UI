'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import AdminGuard from '@/components/ui/AdminGuard';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Mail, 
  Shield, 
  Trash2, 
  Loader2,
  Save,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Smartphone,
  Gift,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/lib/hooks/useToast';
import ToastContainer from '@/components/ui/toast';

interface UserSettings {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  smsNotifications: boolean;
  newsletter: boolean;
  twoFactorAuth: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    smsNotifications: false,
    newsletter: false,
    twoFactorAuth: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/settings');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      const data = await response.json();

      if (response.ok && data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      addToast('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof UserSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      addToast('Settings saved successfully', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      addToast('Please enter your password', 'error');
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch('/api/settings/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmPassword: deletePassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      addToast('Account deleted successfully', 'success');
      
      // Logout and redirect
      setTimeout(() => {
        logout();
        router.push('/');
      }, 2000);

    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to delete account', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDeletePassword('');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        
        <div className="max-w-4xl mx-auto">
          {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-gray-600">Manage your account preferences and notifications</p>
        </div>

        <div className="space-y-6">
          {/* Notifications Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-pink-600" />
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Choose what notifications you want to receive</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Order Updates */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Order Updates</p>
                    <p className="text-sm text-gray-500">Get notified about order status changes</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('orderUpdates')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.orderUpdates ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.orderUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive text messages for important updates</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('smsNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.smsNotifications ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Marketing Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-pink-600" />
                <h2 className="text-xl font-semibold text-gray-900">Marketing Preferences</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Manage promotional communications</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Promotional Emails */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Promotional Emails</p>
                    <p className="text-sm text-gray-500">Receive special offers and promotions</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('promotionalEmails')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.promotionalEmails ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.promotionalEmails ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Newsletter */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Newsletter</p>
                    <p className="text-sm text-gray-500">Subscribe to our monthly newsletter</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('newsletter')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.newsletter ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.newsletter ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-pink-600" />
                <h2 className="text-xl font-semibold text-gray-900">Security</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Manage your account security settings</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security (Coming Soon)</p>
                  </div>
                </div>
                <button
                  disabled
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 cursor-not-allowed opacity-50"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-md border-2 border-red-200 overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
              </div>
              <p className="text-sm text-red-700 mt-1">Irreversible actions</p>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">Delete Account</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Account</h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete your account? This action is permanent and cannot be undone.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                All your data including orders, addresses, and preferences will be permanently deleted.
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm your password to continue:
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || !deletePassword}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Forever</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminGuard>
  );
}
