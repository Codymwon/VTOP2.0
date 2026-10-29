import React, { useState } from 'react';
import { UserRole, LoginResult, VerifyOtpResult, ResendOtpResult, LoginCredentials } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { RoleSwitcher } from '../components/auth/RoleSwitcher';
import { AuthForm } from '../components/auth/AuthForm';
import { OtpModal } from '../components/auth/OtpModal';
import { CampusSpotlight } from '../components/spotlight/CampusSpotlight';
import { MobileAppBadges } from '../components/spotlight/MobileAppBadges';
import { ShieldCheck } from 'lucide-react';

export const PreLoginScreen: React.FC = () => {
  const { login, verifyOtp, resendOtp, apiMode } = useAuth();

  const [role, setRole] = useState<UserRole>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpDestinationMasked, setOtpDestinationMasked] = useState<string | undefined>(undefined);
  const [otpCooldownSeconds, setOtpCooldownSeconds] = useState<number>(180);
  const [otpChannel, setOtpChannel] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [devOtpHint, setDevOtpHint] = useState<string | undefined>(undefined);

  const handleLoginSubmit = async (credentials: LoginCredentials): Promise<LoginResult> => {
    setIsSubmitting(true);
    try {
      const res = await login(credentials);
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpRequired = (
    destinationMasked?: string,
    cooldownSeconds?: number,
    channel?: 'EMAIL' | 'SMS',
    hint?: string
  ) => {
    setOtpDestinationMasked(destinationMasked);
    if (cooldownSeconds) setOtpCooldownSeconds(cooldownSeconds);
    if (channel) setOtpChannel(channel);
    if (hint) setDevOtpHint(hint);
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
    const res = await resendOtp();
    if (res.devOtpHint) {
      setDevOtpHint(res.devOtpHint);
    }
    return res;
  };

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
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Top bar inside left pane: Brand Logo */}
        <div className="relative z-10 flex items-center justify-between mb-4 lg:mb-2">
          <BrandLogo variant="light" size="lg" />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white/90 border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" aria-hidden="true" />
            <span>VIT-AP CAS Enabled</span>
          </div>
        </div>

        {/* Middle: Real-time Campus Notices Spotlight */}
        <div className="relative z-10 my-auto py-2 max-w-xl">
          <CampusSpotlight />
        </div>

        {/* Bottom: University Accreditations */}
        <div className="relative z-10 mt-4 lg:mt-2 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/70">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white/90">Accreditations:</span>
            <span>NAAC A++ Grade</span>
            <span>•</span>
            <span>NIRF Ranked</span>
            <span>•</span>
            <span>ABET Accredited</span>
          </div>
          <div className="text-[11px] text-white/50">
            © {new Date().getFullYear()} VIT-AP University. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Interactive Authentication Rail (46% on lg) */}
      <div className="w-full lg:w-[46%] flex flex-col justify-between p-6 sm:p-8 lg:p-6 xl:p-8 bg-slate-50 lg:h-full lg:overflow-y-auto">
        {/* Top spacer / header */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Enterprise Single Sign-On
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span>Gateway Online</span>
          </div>
        </div>

        {/* Centered Auth Box */}
        <div className="max-w-md w-full mx-auto my-auto py-2">
          {/* Main Card */}
          <div
            id="auth-card"
            tabIndex={-1}
            className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/90 focus:outline-none"
          >
            {/* Title & subtitle */}
            <div className="mb-4">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Sign in to VTOP Portal
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Select your institutional role and enter credentials to continue.
              </p>
            </div>

            {/* Role Switcher Component */}
            <div className="mb-4">
              <RoleSwitcher role={role} onChange={setRole} />
            </div>

            {/* Form Component */}
            <AuthForm
              role={role}
              onSubmit={handleLoginSubmit}
              onOtpRequired={handleOtpRequired}
              isLoading={isSubmitting}
            />

            {/* Mobile App Download Promotion Banner */}
            <div className="mt-4 pt-3.5 border-t border-slate-100">
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
        emailMasked={otpDestinationMasked}
        initialCooldown={otpCooldownSeconds}
        channel={otpChannel}
        devOtpHint={devOtpHint}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onClose={() => setIsOtpOpen(false)}
        isMockMode={apiMode === 'mock'}
      />
    </div>
  );
};
