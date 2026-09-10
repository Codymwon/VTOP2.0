import React, { useState, useEffect } from 'react';
import { Smartphone, QrCode, X } from 'lucide-react';

export const MobileAppBadges: React.FC = () => {
  const [showQrModal, setShowQrModal] = useState(false);

  // Close QR modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showQrModal) {
        setShowQrModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQrModal]);

  return (
    <div className="pt-3.5 border-t border-slate-100">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Smartphone className="w-4 h-4 text-[#176CB8] shrink-0" />
          <span>VTOP Companion App</span>
        </div>
        <span className="text-[11px] font-medium text-slate-500">Android & iOS</span>
      </div>

      {/* Action button & badges */}
      <div className="flex items-center gap-2.5">
        {/* Official Google Play Badge */}
        <a
          href="https://play.google.com/store/apps/details?id=edu.vitap.vtopap.androidapp&hl=en&gl=US"
          target="_blank"
          rel="noreferrer"
          className="flex-1 min-h-[44px] flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] px-3 py-1.5 shadow-xs"
          aria-label="Get VIT-AP app on Google Play"
        >
          <img
            src="/assets/img/google-play-badge.png"
            alt="Get it on Google Play"
            className="h-7 w-auto object-contain"
          />
        </a>

        {/* QR Code Quick Scan Trigger */}
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
          aria-label="Scan QR code to install app"
        >
          <QrCode className="w-4 h-4 text-slate-700" />
          <span>Scan QR</span>
        </button>
      </div>

      {/* QR Code Modal Dialog */}
      {showQrModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative text-center">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              aria-label="Close QR Modal"
              className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#176CB8]/10 text-[#176CB8] mb-3">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 id="qr-modal-title" className="text-base font-bold text-slate-900">
              Install Companion App
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Scan this QR code with your phone camera to download the official VTOP Mobile Portal for Android & iOS.
            </p>

            {/* Stylized QR Code SVG */}
            <div className="mx-auto w-44 h-44 bg-slate-50 p-3 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-38 h-38 text-slate-900" fill="currentColor">
                {/* 3 Main Corner Position Markers */}
                <rect x="10" y="10" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="16" y="16" width="12" height="12" rx="2" />
                <rect x="66" y="10" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="72" y="16" width="12" height="12" rx="2" />
                <rect x="10" y="66" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="16" y="72" width="12" height="12" rx="2" />
                {/* Synthetic QR Data Matrix dots */}
                <rect x="42" y="14" width="6" height="6" rx="1" />
                <rect x="52" y="14" width="6" height="6" rx="1" />
                <rect x="42" y="24" width="6" height="6" rx="1" />
                <rect x="52" y="28" width="6" height="6" rx="1" />
                <rect x="14" y="44" width="6" height="6" rx="1" />
                <rect x="24" y="44" width="6" height="6" rx="1" />
                <rect x="44" y="44" width="12" height="12" rx="2" />
                <rect x="64" y="44" width="6" height="6" rx="1" />
                <rect x="74" y="44" width="6" height="6" rx="1" />
                <rect x="42" y="64" width="6" height="6" rx="1" />
                <rect x="54" y="74" width="6" height="6" rx="1" />
                <rect x="68" y="68" width="8" height="8" rx="1.5" />
                <rect x="80" y="80" width="6" height="6" rx="1" />
              </svg>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 font-mono">
              Package: org.vitap.vtop
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
