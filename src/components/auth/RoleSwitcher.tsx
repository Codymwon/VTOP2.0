import React from 'react';
import { UserRole } from '../../types/auth';
import { ShieldCheck } from 'lucide-react';

interface RoleSwitcherProps {
  role: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

const ROLES: UserRole[] = ['student', 'faculty', 'admin'];

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  role,
  onChange,
  disabled = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, targetRole: UserRole) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(targetRole);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = ROLES.indexOf(role);
      const nextIndex = (currentIndex + 1) % ROLES.length;
      onChange(ROLES[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const currentIndex = ROLES.indexOf(role);
      const prevIndex = (currentIndex - 1 + ROLES.length) % ROLES.length;
      onChange(ROLES[prevIndex]);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Select Portal Access
        </label>
        <span className="text-[11px] font-medium text-slate-400">
          {role === 'student' ? 'Student Portal' : role === 'faculty' ? 'Faculty Portal' : 'Admin Operations'}
        </span>
      </div>
      <div
        role="tablist"
        aria-label="User Role Selection"
        className="grid grid-cols-3 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80 gap-1 sm:gap-1.5"
      >
        {/* Student Tab */}
        <button
          type="button"
          role="tab"
          id="tab-student"
          aria-selected={role === 'student'}
          aria-controls="auth-card"
          tabIndex={role === 'student' ? 0 : -1}
          disabled={disabled}
          onClick={() => onChange('student')}
          onKeyDown={(e) => handleKeyDown(e, 'student')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 min-h-[46px] rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
            role === 'student'
              ? 'bg-white text-[#176CB8] shadow-xs shadow-slate-300 border-2 border-[#3C8DBC] font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-2 border-transparent'
          }`}
        >
          <img
            src="/assets/img/students.png"
            alt=""
            className="w-4.5 h-4.5 sm:w-5 sm:h-5 object-contain shrink-0"
            aria-hidden="true"
          />
          <span className="truncate">Student</span>
        </button>

        {/* Faculty / Employee Tab */}
        <button
          type="button"
          role="tab"
          id="tab-faculty"
          aria-selected={role === 'faculty'}
          aria-controls="auth-card"
          tabIndex={role === 'faculty' ? 0 : -1}
          disabled={disabled}
          onClick={() => onChange('faculty')}
          onKeyDown={(e) => handleKeyDown(e, 'faculty')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 min-h-[46px] rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AC0D] cursor-pointer ${
            role === 'faculty'
              ? 'bg-white text-[#B7950B] shadow-xs shadow-slate-300 border-2 border-[#D4AC0D] font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-2 border-transparent'
          }`}
        >
          <img
            src="/assets/img/employee.png"
            alt=""
            className="w-4.5 h-4.5 sm:w-5 sm:h-5 object-contain shrink-0"
            aria-hidden="true"
          />
          <span className="truncate">Faculty</span>
        </button>

        {/* Admin / Executive Tab */}
        <button
          type="button"
          role="tab"
          id="tab-admin"
          aria-selected={role === 'admin'}
          aria-controls="auth-card"
          tabIndex={role === 'admin' ? 0 : -1}
          disabled={disabled}
          onClick={() => onChange('admin')}
          onKeyDown={(e) => handleKeyDown(e, 'admin')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 min-h-[46px] rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] cursor-pointer ${
            role === 'admin'
              ? 'bg-white text-[#6D28D9] shadow-xs shadow-slate-300 border-2 border-[#7C3AED] font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-2 border-transparent'
          }`}
        >
          <ShieldCheck className={`w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0 ${role === 'admin' ? 'text-[#7C3AED]' : 'text-slate-500'}`} aria-hidden="true" />
          <span className="truncate">Admin</span>
        </button>
      </div>
    </div>
  );
};
