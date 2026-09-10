import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
}) => {
  const isDark = variant === 'dark';

  // Sizing styles for official logo PNGs
  const heightClass =
    size === 'lg' ? 'h-11 sm:h-12' : size === 'sm' ? 'h-7 sm:h-8' : 'h-9 sm:h-10';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Official VIT-AP Logo Image */}
      <div className="flex items-center">
        {isDark ? (
          <img
            src="/assets/img/VIT_AP_logo.png"
            alt="VIT-AP University Logo"
            className={`${heightClass} w-auto object-contain drop-shadow-xs`}
          />
        ) : (
          <img
            src="/assets/img/vitapnewlogo.png"
            alt="VIT-AP University Logo"
            className={`${heightClass} w-auto object-contain`}
          />
        )}
      </div>

      {/* VTOP 2.0 Modern Badge */}
      <div className="flex items-center border-l border-white/20 pl-3">
        <span
          className={`text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold tracking-wider uppercase border shadow-2xs ${
            isDark
              ? 'bg-[#3497DB]/20 text-[#3497DB] border-[#3497DB]/40'
              : 'bg-[#176CB8]/10 text-[#176CB8] border-[#176CB8]/25'
          }`}
        >
          VTOP 2.0
        </span>
      </div>
    </div>
  );
};
