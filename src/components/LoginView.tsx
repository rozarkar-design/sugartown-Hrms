import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';

interface LoginViewProps {
  onLoginSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login, showToast } = useHRMS();

  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordResetDone, setIsPasswordResetDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId) {
      showToast('Please enter your Super Admin Mobile Number or ID', 'error');
      return;
    }
    const success = login(emailOrId, password);
    if (success && onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your registered admin email address', 'error');
      return;
    }
    setOtpSent(true);
    showToast('Verification OTP sent to registered email address.', 'info');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '482910' && otpCode.length !== 6) {
      showToast('Invalid verification code. Please check and try again.', 'error');
      return;
    }
    setIsPasswordResetDone(true);
    showToast('Password updated successfully! You can now log in.', 'success');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 selection:bg-orange-100 selection:text-orange-900">
      <div className="w-full max-w-md">
        {/* Main Card - Professional Polish */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-500 text-white font-bold text-2xl flex items-center justify-center shadow-sm mx-auto mb-3">
              S
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Sugartown <span className="text-orange-500">HRMS</span>
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Super Admin Authentication Portal
            </p>
          </div>

          {/* Access Security Banner without any password hint */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Super Administrator Access</p>
              <p className="text-[11px] text-slate-500">
                Authorized access only. All login activities are monitored and logged.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Super Admin Mobile Number or ID
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-400">
                  {/^\d+$/.test(emailOrId.trim()) ? (
                    <Phone className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Mail className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <input
                  id="login-email-input"
                  type="text"
                  required
                  placeholder="e.g. 9145448010 or ST-1001"
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(true);
                    setOtpSent(false);
                    setIsPasswordResetDone(false);
                  }}
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <span>Remember this device</span>
              </label>
              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 256-bit SSL
              </span>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full rounded-lg bg-orange-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>Sign In as Super Admin</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Security Footer */}
        <p className="mt-6 text-center text-[11px] text-slate-400">
          Sugartown Retail Private Limited • Registered in Mumbai, India.
          <br />
          For HR portal support, contact <span className="underline hover:text-slate-600 cursor-pointer">support@sugartown.in</span>
        </p>

        {/* Forgot Password Modal with OTP verification */}
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in duration-150">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Reset Password</h3>
                  <p className="text-xs text-slate-500">OTP-verified password recovery</p>
                </div>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registered Super Admin Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@sugartown.in"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(false)}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700 cursor-pointer"
                    >
                      Send 6-Digit OTP
                    </button>
                  </div>
                </form>
              ) : !isPasswordResetDone ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-200">
                    OTP sent to <span className="font-semibold text-slate-900">{forgotEmail}</span>. Demo OTP code: <span className="font-bold text-orange-600">482910</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="482910"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono tracking-widest text-center text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(false)}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700 cursor-pointer"
                    >
                      Verify & Reset
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-900">Password Reset Completed</p>
                  <p className="text-xs text-slate-500">Your account password has been updated securely.</p>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="w-full rounded-lg bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
