import React, { useState, useEffect, useRef } from 'react';
import { Clock, RefreshCw, AlertTriangle, ArrowLeft, Loader2, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { VerifyOtpResult, ResendOtpResult } from '../../types/auth';

interface OtpModalProps {
  isOpen: boolean;
  emailMasked?: string;
  initialCooldown?: number;
  channel?: 'EMAIL' | 'SMS';
  devOtpHint?: string;
  onVerify: (otp: string) => Promise<VerifyOtpResult>;
  onResend: () => Promise<ResendOtpResult>;
  onClose: () => void;
  isMockMode?: boolean;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  emailMasked = 'your institutional email',
  initialCooldown = 180,
  channel = 'EMAIL',
  onVerify,
  onResend,
  onClose,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState<number>(initialCooldown);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(4);
  const [resendSuccessNotice, setResendSuccessNotice] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    setCooldown(initialCooldown);
    setDigits(['', '', '', '', '', '']);
    setErrorMessage(null);
    setAttemptsRemaining(4);

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  }, [isOpen, initialCooldown]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

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
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const digit = cleaned[cleaned.length - 1];
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setErrorMessage(null);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else {
      const completeCode = newDigits.join('');
      if (completeCode.length === 6) {
        triggerVerify(completeCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
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
        setResendSuccessNotice(`A fresh OTP has been dispatched to your ${channel === 'EMAIL' ? 'email' : 'mobile'}.`);
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
            {channel === 'EMAIL' ? <Mail className="w-7 h-7" /> : <Phone className="w-7 h-7" />}
          </div>
          <h2 id="otp-modal-title" className="text-xl font-bold text-slate-900">
            Two-Factor Authentication
          </h2>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            {channel === 'EMAIL' ? 'Dispatched to verified institutional email:' : 'Sent via SMS to registered mobile number:'}
            <span className="block font-mono font-bold text-slate-900 text-sm mt-0.5">{emailMasked}</span>
          </p>

          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <span>Check your inbox & spam folder for the security code.</span>
          </div>
        </div>

        {/* Success Notice on Resend */}
        {resendSuccessNotice && (
          <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resendSuccessNotice}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{errorMessage}</p>
              {attemptsRemaining < 4 && attemptsRemaining > 0 && (
                <p className="text-[11px] text-red-600 mt-0.5 font-medium">
                  {attemptsRemaining} attempt{attemptsRemaining > 1 ? 's' : ''} remaining before temporary lockout.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 6 Digit Inputs */}
        <div className="flex justify-center items-center gap-2.5 sm:gap-3 mb-6">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold rounded-xl border transition-all focus:outline-none ${
                digit
                  ? 'border-[#176CB8] bg-blue-50/40 text-[#176CB8]'
                  : 'border-slate-300 bg-white text-slate-900'
              } focus:border-[#176CB8] focus:ring-2 focus:ring-[#176CB8]/20`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => triggerVerify(fullCode)}
          disabled={fullCode.length !== 6 || isVerifying}
          className="w-full py-2.5 px-4 bg-[#176CB8] hover:bg-[#135796] text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying 2FA Credentials...</span>
            </>
          ) : (
            <span>Authenticate Session</span>
          )}
        </button>

        {/* Cooldown & Resend */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Expires: {formatTime(cooldown)}</span>
          </div>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            className="flex items-center gap-1 text-[#176CB8] hover:text-[#135796] font-semibold disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {isResending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            <span>Resend OTP</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full py-1.5 text-slate-500 hover:text-slate-800 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </button>
      </div>
    </div>
  );
};
