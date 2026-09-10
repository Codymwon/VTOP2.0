import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, User, LogOut, ShieldCheck, School, Award } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const AuthSuccessBanner: React.FC = () => {
  const { user, session, logout } = useAuth();

  if (!user || !session) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10">
        <BrandLogo variant="dark" size="md" />
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-all border border-white/15 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full my-auto py-10">
        <div className="bg-slate-800/80 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Success Badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Phase 1 Gate Passed
              </span>
              <h2 className="text-2xl font-bold text-white">
                Authenticated Session Established
              </h2>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            User credentials and two-factor OTP verification succeeded. A role-governed session has been generated matching the VTOP data model.
          </p>

          {/* User Card */}
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
            <div>
              <span className="text-slate-300 font-medium block mb-0.5">Full Name</span>
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-400" aria-hidden="true" />
                {user.name}
              </span>
            </div>

            <div>
              <span className="text-slate-300 font-medium block mb-0.5">Registration / Employee ID</span>
              <span className="font-mono font-bold text-sm text-amber-300">
                {user.id}
              </span>
            </div>

            <div>
              <span className="text-slate-300 font-medium block mb-0.5">Portal Role</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize">
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                {user.role}
              </span>
            </div>

            <div>
              <span className="text-slate-300 font-medium block mb-0.5">Institutional Email</span>
              <span className="font-mono text-slate-200">
                {user.email}
              </span>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-white/10">
              <span className="text-slate-300 font-medium block mb-0.5">Academic Department / School</span>
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <School className="w-4 h-4 text-slate-300" aria-hidden="true" />
                {user.school || user.department}
              </span>
            </div>
          </div>

          {/* Next Phase Notice */}
          <div className="p-4 bg-blue-900/30 border border-blue-500/30 rounded-2xl flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block font-semibold mb-1">
                Workflow Rule Enforcement
              </strong>
              Phase 1 (Pre-Login & Auth Gateway) is complete. As per your instructions, the system awaits your approval and the next legacy screenshot (e.g. Student Dashboard, Attendance, or Timetable) before proceeding to Phase 2.
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={logout}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-slate-300 bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out & Test Other Roles</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full py-4 text-center text-xs text-slate-500 border-t border-white/10">
        VIT-AP University • VTOP 2.0 Modernization Project • Phase 1
      </footer>
    </div>
  );
};
