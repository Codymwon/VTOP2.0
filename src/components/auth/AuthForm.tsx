import React, { useState, useEffect, useRef } from 'react';
import { UserRole, LoginResult } from '../../types/auth';
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2, ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react';

interface AuthFormProps {
  role: UserRole;
  onSubmit: (credentials: { username: string; password: string; role: UserRole; rememberMe: boolean }) => Promise<LoginResult>;
  onOtpRequired: (emailMasked?: string, cooldownSeconds?: number) => void;
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

  // Load remembered username if present
  useEffect(() => {
    const saved = localStorage.getItem(`${REMEMBER_ID_KEY}_${role}`);
    if (saved) {
      setUsername(saved);
    } else {
      // Default placeholder pre-fill for fast testing
      setUsername(role === 'student' ? '23BCE1088' : role === 'faculty' ? 'EMP10245' : 'ADM1001');
      setPassword('password123');
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
      });

      if (res.status === 'OTP_REQUIRED') {
        onOtpRequired(res.otpEmailMasked, res.cooldownSeconds);
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
  const isAdmin = role === 'admin';

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      {/* Inline Focusable Error Alert (WCAG 2.2 AA) */}
      {errorMessage && (
        <div
          ref={errorSummaryRef}
          id="auth-error-summary"
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm animate-in fade-in duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <span className="font-semibold block text-xs">Authentication Failed</span>
            <span id="auth-error-desc" className="text-xs">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* User ID Input Field */}
      <div>
        <label
          htmlFor="auth-username"
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
        >
          {isStudent ? 'Registration Number' : isFaculty ? 'Employee ID' : 'Administrator ID'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isAdmin ? (
              <ShieldCheck className="w-4.5 h-4.5 text-[#7C3AED]" aria-hidden="true" />
            ) : (
              <User className="w-4.5 h-4.5" aria-hidden="true" />
            )}
          </div>
          <input
            id="auth-username"
            type="text"
            required
            autoComplete="username"
            autoCapitalize="characters"
            disabled={isLoading}
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? "auth-error-desc" : "auth-username-desc"}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value.toUpperCase());
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder={isStudent ? 'e.g. 23BCE1088' : isFaculty ? 'e.g. EMP10245' : 'e.g. ADM1001'}
            className={`w-full pl-10 pr-4 py-2.5 min-h-[44px] bg-slate-50 border border-slate-300 rounded-xl text-sm sm:text-base text-slate-900 font-medium placeholder-slate-400 tracking-wide focus:bg-white focus:outline-none focus:border-transparent transition-all ${
              isAdmin
                ? 'focus:ring-2 focus:ring-[#7C3AED]'
                : isFaculty
                ? 'focus:ring-2 focus:ring-[#B7950B]'
                : 'focus:ring-2 focus:ring-[#176CB8]'
            }`}
          />
        </div>
        <p id="auth-username-desc" className="mt-1 text-[11px] text-slate-600 font-medium">
          {isStudent
            ? 'Format: Year + Branch + Roll (e.g. 23BCE1088)'
            : isFaculty
            ? 'Official VIT-AP faculty or employee ID (e.g. EMP10245)'
            : 'Central administration, COE, warden or registrar ID (e.g. ADM1001)'}
        </p>
      </div>

      {/* Password Input Field */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="auth-password"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-xs font-semibold text-[#176CB8] hover:text-[#2455A3] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] rounded py-0.5 px-1 cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <input
            id="auth-password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            disabled={isLoading}
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? "auth-error-desc" : undefined}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="••••••••••••"
            className="w-full pl-10 pr-11 py-2.5 min-h-[44px] bg-slate-50 border border-slate-300 rounded-xl text-sm sm:text-base text-slate-900 placeholder-slate-400 tracking-wide focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:border-transparent transition-all"
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 w-11 min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] rounded-r-xl cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-4.5 h-4.5" aria-hidden="true" />
            ) : (
              <Eye className="w-4.5 h-4.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me & Trust Info */}
      <div className="flex items-center justify-between pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none py-0.5">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[#176CB8] focus:ring-[#176CB8] cursor-pointer"
          />
          <span className="text-xs font-semibold text-slate-700">Remember my User ID</span>
        </label>
        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" /> 256-bit Encrypted
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full min-h-[46px] py-3 px-6 rounded-xl font-bold text-white active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer ${
          isAdmin
            ? 'bg-[#6D28D9] hover:bg-[#5B21B6] focus-visible:ring-[#7C3AED] shadow-[#6D28D9]/25'
            : isFaculty
            ? 'bg-[#183668] hover:bg-[#122b52] focus-visible:ring-[#2455A3] shadow-[#183668]/25'
            : 'bg-[#176CB8] hover:bg-[#2455A3] focus-visible:ring-[#176CB8] shadow-[#176CB8]/25'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <span>{isAdmin ? 'Sign In as Administrator' : isFaculty ? 'Sign In as Faculty / Staff' : 'Sign In to VTOP'}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </>
        )}
      </button>

      {/* Forgot Password Modal Helper */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-[#2455A3] mb-3">
              <HelpCircle className="w-6 h-6 text-[#176CB8] shrink-0" />
              <h3 id="forgot-modal-title" className="text-lg font-bold text-slate-900">
                Password Recovery Procedure
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              To safeguard institutional accounts, password resets are handled through the university identity directory:
            </p>
            <ul className="text-xs text-slate-600 space-y-2 mb-5 list-disc pl-5">
              <li>
                <strong>Students:</strong> Access the Microsoft 365 student account recovery at <code>vitap.ac.in/password-reset</code> or contact the Examination / Academic Office.
              </li>
              <li>
                <strong>Faculty & Staff:</strong> Contact University IT Helpdesk at extension <strong>#1040</strong> or email <code>it.helpdesk@vitap.ac.in</code>.
              </li>
              <li>
                <strong>Administrators:</strong> Contact the Security Operations Center (SOC) & Registrar Office at <code>security.admin@vitap.ac.in</code>.
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full min-h-[44px] py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
