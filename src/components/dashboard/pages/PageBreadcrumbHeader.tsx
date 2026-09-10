import React from 'react';
import { ChevronRight, ArrowLeft, Home, Printer } from 'lucide-react';

interface PageBreadcrumbHeaderProps {
  category: string;
  title: string;
  subtitle?: string;
  onBackToDashboard: () => void;
  onPrint?: () => void;
  extraActions?: React.ReactNode;
}

export const PageBreadcrumbHeader: React.FC<PageBreadcrumbHeaderProps> = ({
  category,
  title,
  subtitle,
  onBackToDashboard,
  onPrint,
  extraActions,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs mb-4 sm:mb-5">
      {/* Breadcrumb row */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center gap-1 hover:text-[#176CB8] font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] rounded px-1.5 py-1 min-h-[36px] sm:min-h-[40px]"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
          <span className="font-medium text-slate-500">{category}</span>
          <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-slate-900">{title}</span>
        </nav>

        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </button>
      </div>

      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {extraActions}
          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              aria-label="Print Current Page"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span>Print Page</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
