import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Clock, RefreshCw, AlertTriangle, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { VerifyOtpResult, ResendOtpResult } from '../../types/auth';

interface OtpModalProps {
  isOpen: boolean;
  emailMasked?: string;
  initialCooldown?: number;
  onVerify: (otp: string) => Promise<VerifyOtpResult>;
  onResend: () => Promise<ResendOtpResult>;
  onClose: () => void;
  isMockMode?: boolean;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  emailMasked = 'your institutional email',
  initialCooldown = 180,
  onVerify,
  onResend,
  onClose,
  isMockMode = true,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState<number>(initialCooldown);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(4);
  const [resendSuccessNotice, setResendSuccessNotice] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize and tick countdown timer
  useEffect(() => {
    if (!isOpen) return;

    setCooldown(initialCooldown);
    setDigits(['', '', '', '', '', '']);
    setErrorMessage(null);
    setAttemptsRemaining(4);

    // Autofocus the first box
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  }, [isOpen, initialCooldown]);

  // Countdown interval
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Keyboard trap for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDigitChange = (index: number, val: string) => {
    // Only accept numeric digit
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    // Take the last character typed
    const digit = cleaned[cleaned.length - 1];
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance to next box if not on last
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else {
      // If all 6 digits are filled, automatically submit
      const completeCode = newDigits.join('');
      if (completeCode.length === 6) {
        triggerVerify(completeCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move focus backwards on empty box
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    setErrorMessage(null);

    // Focus either the next empty box or the last box
    const nextIdx = Math.min(pasted.length, 5);
    inputRefs.current[nextIdx]?.focus();

    if (pasted.length === 6) {
      triggerVerify(pasted);
    }
  };

  const triggerVerify = async (code: string) => {
    if (code.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);
    setResendSuccessNotice(null);

    try {
      const result = await onVerify(code);
      if (result.status === 'INVALID_OTP') {
        setErrorMessage(result.message);
        if (result.attemptsRemaining !== undefined) {
          setAttemptsRemaining(result.attemptsRemaining);
        }
        // Shake / reset
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else if (result.status === 'EXPIRED_OTP') {
        setErrorMessage('This OTP has expired. Please click Resend OTP.');
      } else if (result.status === 'MAX_ATTEMPTS_EXCEEDED') {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Failed to verify OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage(null);
    setResendSuccessNotice(null);

    try {
      const res = await onResend();
      if (res.status === 'SUCCESS') {
        setResendSuccessNotice('A new OTP has been dispatched to your email.');
        setCooldown(res.cooldownSeconds || 180);
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const fullCode = digits.join('');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#176CB8]/10 text-[#176CB8] border border-[#176CB8]/20 mb-3.5 shadow-xs">
            <ShieldCheck className="w-8 h-8" aria-hidden="true" />
          </div>
          <h2 id="otp-modal-title" className="text-xl font-bold text-slate-900">
            Two-Factor Authentication
          </h2>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            Enter the 6-digit security OTP dispatched to:
            <span className="block font-semibold text-slate-900 mt-0.5">{emailMasked}</span>
          </p>

          {isMockMode && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-semibold">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Offline Demo Mock OTP: <strong className="font-mono tabular-nums text-amber-900">123456</strong></span>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium mb-4 animate-in fade-in"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{errorMessage}</span>
              {attemptsRemaining < 4 && attemptsRemaining > 0 && (
                <span className="block mt-1 font-bold text-rose-700">
                  {attemptsRemaining} attempt{attemptsRemaining > 1 ? 's' : ''} remaining before session lock.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Resend Success Notice */}
        {resendSuccessNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium mb-4 text-center">
            {resendSuccessNotice}
          </div>
        )}

        {/* 6-Digit Split Inputs */}
        <div className="flex justify-between gap-2 sm:gap-3 mb-6">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              autoComplete="one-time-code"
              disabled={isVerifying || attemptsRemaining === 0}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${idx + 1}`}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono tabular-nums text-xl font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:border-transparent transition-all shadow-xs"
            />
          ))}
        </div>

        {/* Verify CTA Button */}
        <button
          type="button"
          disabled={fullCode.length !== 6 || isVerifying || attemptsRemaining === 0}
          onClick={() => triggerVerify(fullCode)}
          className="w-full min-h-[48px] py-3.5 px-6 rounded-xl font-bold text-white bg-[#176CB8] hover:bg-[#2455A3] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] focus-visible:ring-offset-2 transition-all shadow-md shadow-[#176CB8]/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer mb-4"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying Security Code...</span>
            </>
          ) : (
            <span>Verify & Log In</span>
          )}
        </button>

        {/* Resend & Cooldown Footer */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-slate-400" />
            {cooldown > 0 ? (
              <span>Resend in <strong className="font-mono tabular-nums text-slate-900">{formatTime(cooldown)}</strong></span>
            ) : (
              <span className="text-emerald-700 font-semibold">Ready to resend</span>
            )}
          </div>

          <button
            type="button"
            disabled={cooldown > 0 || isResending || attemptsRemaining === 0}
            onClick={handleResend}
            className="flex items-center gap-1.5 font-semibold text-[#176CB8] hover:text-[#2455A3] disabled:text-slate-400 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] rounded-lg px-2.5 py-1.5 min-h-[44px] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            <span>Resend OTP</span>
          </button>
        </div>

        {/* Cancel / Back Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] rounded-lg py-2 px-3 min-h-[44px] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
};
