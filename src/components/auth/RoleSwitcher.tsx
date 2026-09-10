import React from 'react';
import { UserRole } from '../../types/auth';

interface RoleSwitcherProps {
  role: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  role,
  onChange,
  disabled = false,
}) => {
  const isStudent = role === 'student';

  const handleKeyDown = (e: React.KeyboardEvent, targetRole: UserRole) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(targetRole);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange(isStudent ? 'faculty' : 'student');
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        Select Portal Access
      </label>
      <div
        role="tablist"
        aria-label="User Role Selection"
        className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80 gap-1.5"
      >
        {/* Student Tab */}
        <button
          type="button"
          role="tab"
          id="tab-student"
          aria-selected={isStudent}
          aria-controls="panel-student"
          tabIndex={isStudent ? 0 : -1}
          disabled={disabled}
          onClick={() => onChange('student')}
          onKeyDown={(e) => handleKeyDown(e, 'student')}
          className={`flex items-center justify-center gap-2.5 py-2.5 px-4 min-h-[48px] rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
            isStudent
              ? 'bg-white text-[#176CB8] shadow-sm shadow-slate-300 border-2 border-[#3C8DBC] font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <img
            src="/assets/img/students.png"
            alt=""
            className="w-6 h-6 object-contain"
            aria-hidden="true"
          />
          <span>Student</span>
        </button>

        {/* Faculty / Employee Tab */}
        <button
          type="button"
          role="tab"
          id="tab-faculty"
          aria-selected={!isStudent}
          aria-controls="panel-faculty"
          tabIndex={!isStudent ? 0 : -1}
          disabled={disabled}
          onClick={() => onChange('faculty')}
          onKeyDown={(e) => handleKeyDown(e, 'faculty')}
          className={`flex items-center justify-center gap-2.5 py-2.5 px-4 min-h-[48px] rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AC0D] cursor-pointer ${
            !isStudent
              ? 'bg-white text-[#B7950B] shadow-sm shadow-slate-300 border-2 border-[#D4AC0D] font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <img
            src="/assets/img/employee.png"
            alt=""
            className="w-6 h-6 object-contain"
            aria-hidden="true"
          />
          <span>Faculty / Staff</span>
        </button>
      </div>
    </div>
  );
};
