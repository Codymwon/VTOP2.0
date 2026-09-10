import React, { useState } from 'react';
import { UserRole, LoginResult, VerifyOtpResult, ResendOtpResult } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { RoleSwitcher } from '../components/auth/RoleSwitcher';
import { AuthForm } from '../components/auth/AuthForm';
import { OtpModal } from '../components/auth/OtpModal';
import { CampusSpotlight } from '../components/spotlight/CampusSpotlight';
import { MobileAppBadges } from '../components/spotlight/MobileAppBadges';
import { Users, ShieldCheck } from 'lucide-react';

export const PreLoginScreen: React.FC = () => {
  const { login, verifyOtp, resendOtp, apiMode } = useAuth();

  const [role, setRole] = useState<UserRole>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpEmailMasked, setOtpEmailMasked] = useState<string | undefined>(undefined);
  const [otpCooldownSeconds, setOtpCooldownSeconds] = useState<number>(180);
  const [portalNotice, setPortalNotice] = useState<{ title: string; desc: string } | null>(null);

  const handleLoginSubmit = async (credentials: {
    username: string;
    password: string;
    role: UserRole;
    rememberMe: boolean;
  }): Promise<LoginResult> => {
    setIsSubmitting(true);
    try {
      const res = await login(credentials);
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpRequired = (emailMasked?: string, cooldownSeconds?: number) => {
    setOtpEmailMasked(emailMasked);
    if (cooldownSeconds) setOtpCooldownSeconds(cooldownSeconds);
    setIsOtpOpen(true);
  };

  const handleVerifyOtp = async (otp: string): Promise<VerifyOtpResult> => {
    const res = await verifyOtp(otp);
    if (res.status === 'SUCCESS') {
      setIsOtpOpen(false);
    }
    return res;
  };

  const handleResendOtp = async (): Promise<ResendOtpResult> => {
    return await resendOtp();
  };

  // Close portal notice modal on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && portalNotice) {
        setPortalNotice(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [portalNotice]);

  return (
    <div className="min-h-[100dvh] lg:h-[100dvh] flex flex-col lg:flex-row bg-slate-50 relative lg:overflow-hidden">
      {/* Skip Link for Keyboard Accessibility (WCAG 2.4.1) */}
      <a
        href="#auth-card"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:py-2.5 focus:px-4 focus:bg-[#176CB8] focus:text-white focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#176CB8] text-xs font-bold transition-all cursor-pointer"
      >
        Skip to Login Form
      </a>

      {/* LEFT PANE: Institutional Branding & Campus Spotlight (54% on lg) */}
      <div
        className="relative w-full lg:w-[54%] text-white p-6 sm:p-8 lg:p-6 xl:p-8 flex flex-col justify-between lg:h-full lg:overflow-hidden shadow-xl lg:shadow-2xl z-10"
        style={{
          background: 'linear-gradient(135deg, #183668 0%, #2455A3 35%, #2874A6 70%, #1B4F72 100%)'
        }}
      >
        {/* Subtle Decorative Background Geometry */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Top Branding Header */}
        <div className="relative z-10 mb-3 lg:mb-4 shrink-0">
          <BrandLogo variant="dark" size="lg" />
        </div>

        {/* Center: Live Campus Spotlight & Notices */}
        <div className="relative z-10 flex-1 my-auto flex flex-col justify-center min-h-0">
          <CampusSpotlight />
        </div>

        {/* Bottom Legal / Accreditation Strip */}
        <div className="relative z-10 pt-1.5 mt-1 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-blue-200/75 font-medium shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>ISO 9001:2015 Certified Institutional Portal</span>
          </div>
          <span>© 2026 VIT-AP University. All Rights Reserved.</span>
        </div>
      </div>

      {/* RIGHT PANE: Unified Authentication Gateway (46% on lg) */}
      <div className="w-full lg:w-[46%] flex flex-col justify-between p-4 sm:p-6 lg:p-4 xl:p-6 bg-[#F4F6F9] lg:h-full lg:overflow-hidden">
        {/* Mobile-only header view */}
        <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <BrandLogo variant="light" size="sm" />
          <span className="text-xs font-bold text-[#176CB8] bg-[#176CB8]/10 px-2.5 py-1 rounded-full border border-[#176CB8]/20">
            Auth Gateway
          </span>
        </div>

        {/* Main Authentication Card */}
        <div className="w-full max-w-md mx-auto my-auto py-1 sm:py-2">
          <div
            id="auth-card"
            tabIndex={-1}
            className="bg-white rounded-3xl p-5 sm:p-6 lg:p-6 shadow-xl shadow-slate-300/40 border border-slate-200/90 relative focus:outline-none"
          >
            {/* Card Header */}
            <div className="mb-3.5 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Sign In to VTOP
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Welcome back! Select your role and provide your institutional credentials to proceed.
              </p>
            </div>

            {/* Role Switcher */}
            <div className="mb-3.5">
              <RoleSwitcher
                role={role}
                onChange={(newRole) => setRole(newRole)}
                disabled={isSubmitting}
              />
            </div>

            {/* Authentication Form */}
            <AuthForm
              role={role}
              onSubmit={handleLoginSubmit}
              onOtpRequired={handleOtpRequired}
              isLoading={isSubmitting}
            />

            {/* Alternative Legacy Portals (Parent & Alumni Links) */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500 block mb-1.5 font-medium">
                Need access to secondary portals?
              </span>
              <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPortalNotice({
                    title: 'VIT-AP Parent Portal',
                    desc: 'The Parent Information Desk provides real-time access to student attendance, academic progress reports, and fee payment receipts. Authenticate using your registered parent mobile number or email.'
                  })}
                  className="text-slate-600 hover:text-[#176CB8] min-h-[40px] flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] rounded-lg py-1 px-2 cursor-pointer"
                >
                  <img src="/assets/img/parent.png" alt="" className="w-4 h-4 object-contain" aria-hidden="true" />
                  <span>Parent Portal</span>
                </button>

                <span className="text-slate-300">•</span>

                <button
                  type="button"
                  onClick={() => setPortalNotice({
                    title: 'VIT-AP Alumni Global Network',
                    desc: 'Alumni portal facilitates transcript requests, degree verification, alumni association memberships, and campus visit coordination.'
                  })}
                  className="text-slate-600 hover:text-[#176CB8] min-h-[40px] flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] rounded-lg py-1 px-2 cursor-pointer"
                >
                  <img src="/assets/img/alumni.png" alt="" className="w-4 h-4 object-contain" aria-hidden="true" />
                  <span>Alumni Portal</span>
                </button>
              </div>
            </div>

            {/* Mobile App Download Integration */}
            <div className="mt-3">
              <MobileAppBadges />
            </div>
          </div>

          {/* IT Helpdesk Contact Footer */}
          <div className="mt-3 text-center text-xs text-slate-600">
            <span>Having trouble signing in? </span>
            <a
              href="mailto:it.helpdesk@vitap.ac.in"
              className="font-semibold text-[#176CB8] hover:text-[#2455A3] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] rounded py-0.5 px-1"
            >
              Contact IT Helpdesk
            </a>
          </div>
        </div>

        {/* Bottom subtle note */}
        <div className="text-center text-[11px] text-slate-500 pt-1.5 font-medium shrink-0">
          Session protected by VIT-AP Central Authentication Service (CAS)
        </div>
      </div>

      {/* Two-Factor OTP Interactive Modal */}
      <OtpModal
        isOpen={isOtpOpen}
        emailMasked={otpEmailMasked}
        initialCooldown={otpCooldownSeconds}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onClose={() => setIsOtpOpen(false)}
        isMockMode={apiMode === 'mock'}
      />

      {/* Secondary Portal Notice Modal */}
      {portalNotice && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="portal-notice-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#176CB8]/10 text-[#176CB8] mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 id="portal-notice-title" className="text-base font-bold text-slate-900">
              {portalNotice.title}
            </h3>
            <p className="text-xs text-slate-600 mt-2 mb-5 leading-relaxed">
              {portalNotice.desc}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPortalNotice(null)}
                className="flex-1 min-h-[44px] py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  setPortalNotice(null);
                }}
                className="flex-1 min-h-[44px] py-2.5 px-4 bg-[#176CB8] hover:bg-[#2455A3] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
