import React, { useState, useEffect, useRef } from 'react';
import { UserRole, LoginResult, LoginCredentials } from '../../types/auth';
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2, ArrowRight, HelpCircle, ShieldCheck, Mail, Phone } from 'lucide-react';

interface AuthFormProps {
  role: UserRole;
  onSubmit: (credentials: LoginCredentials) => Promise<LoginResult>;
  onOtpRequired: (destinationMasked?: string, cooldownSeconds?: number, channel?: 'EMAIL' | 'SMS', devOtpHint?: string) => void;
  isLoading: boolean;
}

const REMEMBER_ID_KEY = 'vtop_remembered_user_id';

export const AuthForm: React.FC<AuthFormProps> = ({
  role,
  onSubmit,
  onOtpRequired,
  isLoading,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'sms'>('email');
  const [targetEmail, setTargetEmail] = useState('');
  const [targetPhone, setTargetPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // Close forgot password modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showForgotModal) {
        setShowForgotModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForgotModal]);

  // Load default/remembered credentials when role changes
  useEffect(() => {
    const saved = localStorage.getItem(`${REMEMBER_ID_KEY}_${role}`);
    if (saved) {
      setUsername(saved);
    } else {
      setUsername(role === 'student' ? '23MIC7209' : role === 'faculty' ? 'EMP10245' : 'ADM1001');
    }
    setPassword('password123');

    if (role === 'student') {
      setTargetEmail('akarsh.23mic7209@vitapstudent.ac.in');
      setTargetPhone('+91 98401 23456');
    } else if (role === 'faculty') {
      setTargetEmail('hussain.syed@vitap.ac.in');
      setTargetPhone('+91 94432 10987');
    } else {
      setTargetEmail('sk.narayanan@vitap.ac.in');
      setTargetPhone('+91 98765 43210');
    }

    setErrorMessage(null);
  }, [role]);

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => {
      errorSummaryRef.current?.focus();
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim().toUpperCase();
    if (!cleanUsername) {
      triggerError(
        role === 'student'
          ? 'Please enter your Registration Number.'
          : role === 'faculty'
          ? 'Please enter your Employee ID.'
          : 'Please enter your Administrator ID.'
      );
      return;
    }

    if (!password) {
      triggerError('Please enter your portal password.');
      return;
    }

    // Email domain validation
    if (deliveryMethod === 'email') {
      const cleanEmail = targetEmail.trim().toLowerCase();
      if (!cleanEmail) {
        triggerError('Please enter your institutional email address.');
        return;
      }
      if (role === 'student' && !cleanEmail.endsWith('@vitapstudent.ac.in')) {
        triggerError('Student email must end with @vitapstudent.ac.in (e.g. anything@vitapstudent.ac.in)');
        return;
      }
      if (role === 'faculty' && !cleanEmail.endsWith('@vitap.ac.in')) {
        triggerError('Faculty email must end with @vitap.ac.in (e.g. anything@vitap.ac.in)');
        return;
      }
    } else {
      if (!targetPhone.trim()) {
        triggerError('Please enter your registered mobile number for SMS OTP.');
        return;
      }
    }

    if (rememberMe) {
      localStorage.setItem(`${REMEMBER_ID_KEY}_${role}`, cleanUsername);
    } else {
      localStorage.removeItem(`${REMEMBER_ID_KEY}_${role}`);
    }

    try {
      const res = await onSubmit({
        username: cleanUsername,
        password,
        role,
        rememberMe,
        deliveryMethod,
        targetEmail: deliveryMethod === 'email' ? targetEmail.trim().toLowerCase() : undefined,
        targetPhone: deliveryMethod === 'sms' ? targetPhone.trim() : undefined,
      });

      if (res.status === 'OTP_REQUIRED') {
        onOtpRequired(
          res.destinationMasked || res.otpEmailMasked,
          res.cooldownSeconds,
          res.channel || (deliveryMethod === 'sms' ? 'SMS' : 'EMAIL'),
          res.devOtpHint
        );
      } else if (res.status === 'INVALID_CREDENTIALS') {
        triggerError(res.message || 'Invalid User ID or Password.');
      } else if (res.status === 'ERROR') {
        triggerError(res.message || 'An error occurred during authentication.');
      }
    } catch {
      triggerError('Unable to connect to authentication gateway. Please check your network.');
    }
  };

  const isStudent = role === 'student';
  const isFaculty = role === 'faculty';

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
      {/* Focusable Error Alert */}
      {errorMessage && (
        <div
          ref={errorSummaryRef}
          id="auth-error-summary"
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in duration-150 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span className="font-medium leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* User ID Field */}
      <div>
        <label htmlFor="user-id" className="block text-xs font-semibold text-slate-700 mb-1">
          {isStudent ? 'Registration Number' : isFaculty ? 'Employee ID' : 'Administrator ID'}
          <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="user-id"
            type="text"
            required
            autoCapitalize="characters"
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value.toUpperCase());
              setErrorMessage(null);
            }}
            placeholder={isStudent ? 'e.g. 23MIC7209' : isFaculty ? 'e.g. EMP10245' : 'e.g. ADM1001'}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono tracking-wider placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:border-[#176CB8] transition-all"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" aria-label="Portal Password" className="text-xs font-semibold text-slate-700">
            Password <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-[11px] font-medium text-[#176CB8] hover:text-[#135796] hover:underline focus:outline-none focus:ring-1 focus:ring-[#176CB8] rounded cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage(null);
            }}
            placeholder="••••••••••••"
            className="w-full pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:border-[#176CB8] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2FA Delivery Target Section */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#176CB8]" />
            2FA OTP Dispatch Method
          </span>
          <div className="inline-flex rounded-lg bg-slate-200 p-0.5 text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => { setDeliveryMethod('email'); setErrorMessage(null); }}
              className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                deliveryMethod === 'email' ? 'bg-white text-[#176CB8] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3 h-3" /> Email
            </button>
            <button
              type="button"
              onClick={() => { setDeliveryMethod('sms'); setErrorMessage(null); }}
              className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                deliveryMethod === 'sms' ? 'bg-white text-[#176CB8] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3 h-3" /> Mobile SMS
            </button>
          </div>
        </div>

        {deliveryMethod === 'email' ? (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="target-email" className="text-[11px] font-semibold text-slate-600">
                Institutional Email Address
              </label>
              <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                {isStudent ? 'Must end with @vitapstudent.ac.in' : 'Must end with @vitap.ac.in'}
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                id="target-email"
                type="email"
                value={targetEmail}
                onChange={(e) => { setTargetEmail(e.target.value); setErrorMessage(null); }}
                placeholder={isStudent ? 'e.g. anything@vitapstudent.ac.in' : 'e.g. anything@vitap.ac.in'}
                className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              OTP will be sent directly to this address (even if not pre-stored in the database).
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="target-phone" className="text-[11px] font-semibold text-slate-600">
                Registered Mobile Number
              </label>
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-100/70 px-1.5 py-0.5 rounded">
                Must be registered on record
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <input
                id="target-phone"
                type="tel"
                value={targetPhone}
                onChange={(e) => { setTargetPhone(e.target.value); setErrorMessage(null); }}
                placeholder="+91 98401 23456"
                className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              An SMS will be dispatched to your registered institutional mobile number.
            </p>
          </div>
        )}
      </div>

      {/* Remember ID & Security Notice */}
      <div className="flex items-center justify-between pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-3.5 h-3.5 text-[#176CB8] border-slate-300 rounded focus:ring-[#176CB8] cursor-pointer"
          />
          <span className="text-xs text-slate-600">Remember Registration ID</span>
        </label>
      </div>

      {/* Submit Action */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-[#176CB8] hover:bg-[#135796] active:bg-[#0f4477] text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-900/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>Verifying Credentials & Dispatching OTP...</span>
          </>
        ) : (
          <>
            <span>Proceed to 2FA Verification</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </>
        )}
      </button>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-slate-900 mb-3">
              <HelpCircle className="w-5 h-5 text-[#176CB8]" aria-hidden="true" />
              <h3 id="forgot-modal-title" className="font-bold text-sm">Reset VTOP Portal Password</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Password resets are governed by the Center for Technical Support (CTS). Please contact <strong>admin.cts@vitap.ac.in</strong> or visit the IT Helpdesk at Academic Block 1.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Advisory
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
