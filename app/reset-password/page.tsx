'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowLeft, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    email: emailFromUrl,
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  useEffect(() => {
    if (emailFromUrl) {
      setFormData(prev => ({ ...prev, email: emailFromUrl }));
    }
  }, [emailFromUrl]);

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, newPassword: password });
    checkPasswordStrength(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.code || !formData.newPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (passwordStrength < 3) {
      toast.error('Password is too weak. Use uppercase, lowercase, and numbers.');
      return;
    }

    setLoading(true);

    try {
      // Reset password (includes OTP verification)
      const resetResponse = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          newPassword: formData.newPassword,
        }),
      });

      const resetData = await resetResponse.json();

      if (resetResponse.ok) {
        toast.success('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error(resetData.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          type: 'password_reset',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('New code sent to your email!');
      } else {
        toast.error(data.error || 'Failed to resend code');
      }
    } catch (error) {
      toast.error('Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" richColors />
      
      <div className="max-w-md w-full">
        {/* Back to Login */}
        <Link 
          href="/login"
          className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6 transition group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full mb-4">
              <Lock className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600">
              Enter the code sent to your email and create a new password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Reset Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reset Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '') })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-center text-2xl tracking-widest font-semibold"
                placeholder="000000"
              />
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-pink-600 hover:text-pink-700 mt-2 font-medium"
              >
                Didn't receive code? Resend
              </button>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Strength & Requirements */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-4 space-y-3">
              {/* Password Strength Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-700">Password Strength</span>
                  <span className={`text-xs font-semibold ${
                    passwordStrength < 3 ? 'text-red-600' : 
                    passwordStrength < 4 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {passwordStrength < 3 ? 'Weak' : passwordStrength < 4 ? 'Good' : 'Strong'}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        level <= passwordStrength 
                          ? passwordStrength < 3 
                            ? 'bg-red-500' 
                            : passwordStrength < 4 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Requirements Checklist */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
                <ul className="space-y-1">
                  <li className={`text-xs flex items-center gap-1 ${
                    formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    <CheckCircle className={`w-3 h-3 ${
                      formData.newPassword.length >= 8 ? 'opacity-100' : 'opacity-30'
                    }`} />
                    At least 8 characters
                  </li>
                  <li className={`text-xs flex items-center gap-1 ${
                    /[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    <CheckCircle className={`w-3 h-3 ${
                      /[A-Z]/.test(formData.newPassword) ? 'opacity-100' : 'opacity-30'
                    }`} />
                    One uppercase letter
                  </li>
                  <li className={`text-xs flex items-center gap-1 ${
                    /[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    <CheckCircle className={`w-3 h-3 ${
                      /[a-z]/.test(formData.newPassword) ? 'opacity-100' : 'opacity-30'
                    }`} />
                    One lowercase letter
                  </li>
                  <li className={`text-xs flex items-center gap-1 ${
                    /[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    <CheckCircle className={`w-3 h-3 ${
                      /[0-9]/.test(formData.newPassword) ? 'opacity-100' : 'opacity-30'
                    }`} />
                    One number
                  </li>
                  <li className={`text-xs flex items-center gap-1 ${
                    formData.newPassword === formData.confirmPassword && formData.newPassword 
                      ? 'text-green-600' 
                      : 'text-gray-600'
                  }`}>
                    <CheckCircle className={`w-3 h-3 ${
                      formData.newPassword === formData.confirmPassword && formData.newPassword 
                        ? 'opacity-100' 
                        : 'opacity-30'
                    }`} />
                    Passwords match
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
