import React, { useState } from 'react';
import { SpotlightAlert } from '../../types/dashboard';
import { ExternalLink, X, Zap } from 'lucide-react';

interface SpotlightBannerProps {
  alert: SpotlightAlert;
}

export const SpotlightBanner: React.FC<SpotlightBannerProps> = ({ alert }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      role="region"
      aria-label="Urgent Spotlight Alert"
      className="w-full bg-gradient-to-r from-[#183668] via-[#2455A3] to-[#176CB8] text-white rounded-2xl p-3.5 sm:p-4 shadow-xs border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200"
    >
      {/* Left Icon & Information */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <Zap className="w-5 h-5" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
              {alert.tag}
            </span>
            <span className="text-xs font-semibold text-blue-100">
              {alert.category}
            </span>
            {alert.expiresText && (
              <span className="text-xs text-amber-200 font-semibold tabular-nums">
                • {alert.expiresText}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm font-bold text-white leading-snug">
            {alert.title}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <a
          href={alert.url}
          onClick={(e) => {
            e.preventDefault();
            window.open('https://vtop.vitap.ac.in', '_blank');
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] bg-white text-[#183668] hover:bg-blue-50 font-bold text-xs rounded-xl shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        >
          <span>Launch Quiz</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss this announcement"
          className="w-11 h-11 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
