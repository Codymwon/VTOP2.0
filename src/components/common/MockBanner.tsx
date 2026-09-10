import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Database, Wifi, Sliders, Check, ShieldAlert, Cpu } from 'lucide-react';

export const MockBanner: React.FC = () => {
  const { apiMode, simulateOtp, setApiMode, setSimulateOtp } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-white text-xs px-4 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mode Status Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{apiMode === 'mock' ? 'Offline Demo Mock Layer' : 'Live Rust Backend Bridge'}</span>
          </div>

          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            {apiMode === 'mock' 
              ? 'Zero network errors guaranteed • Realistic OTP & data fallbacks'
              : 'Connecting to http://localhost:8080'}
          </span>
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
            aria-expanded={isExpanded}
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>Demo Controls</span>
          </button>
        </div>
      </div>

      {/* Expanded Controls Drawer */}
      {isExpanded && (
        <div className="max-w-7xl mx-auto pt-3 pb-2 mt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-300 animate-in fade-in duration-150">
          {/* Engine Selector */}
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="block font-semibold text-slate-200 text-xs mb-1.5 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" /> API Gateway Mode
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setApiMode('mock')}
                className={`flex-1 py-1.5 px-2.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  apiMode === 'mock'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {apiMode === 'mock' && <Check className="w-3 h-3" />}
                <span>Mock Fallback</span>
              </button>
              <button
                type="button"
                onClick={() => setApiMode('live')}
                className={`flex-1 py-1.5 px-2.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  apiMode === 'live'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {apiMode === 'live' && <Check className="w-3 h-3" />}
                <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Live Server</span>
              </button>
            </div>
          </div>

          {/* 2FA OTP Challenge Toggle */}
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="block font-semibold text-slate-200 text-xs mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Two-Factor OTP Simulation
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSimulateOtp(true)}
                className={`flex-1 py-1.5 px-2.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  simulateOtp
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {simulateOtp && <Check className="w-3 h-3" />}
                <span>Require OTP (2FA)</span>
              </button>
              <button
                type="button"
                onClick={() => setSimulateOtp(false)}
                className={`flex-1 py-1.5 px-2.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  !simulateOtp
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {!simulateOtp && <Check className="w-3 h-3" />}
                <span>Direct Login</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Info */}
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
            <span className="block font-semibold text-slate-200 text-xs flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Evaluation Presets
            </span>
            <p className="text-[11px] text-slate-400 leading-tight">
              Test OTP: <code className="text-amber-300 font-mono font-bold">123456</code>. 
              Rust logic: Max 4 attempts, 180s cooldown.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
