import React from 'react';
import { Calendar, Navigation, Award, CreditCard, FolderGit2 } from 'lucide-react';

interface QuickActionsBarProps {
  onOpenTimetable: () => void;
  onOpenOuting: () => void;
  onOpenGrades: () => void;
  onOpenReceipts: () => void;
  onOpenCoursePage: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onOpenTimetable,
  onOpenOuting,
  onOpenGrades,
  onOpenReceipts,
  onOpenCoursePage,
}) => {
  const actions = [
    {
      id: 'timetable',
      label: 'Weekly Timetable',
      sublabel: 'Room allocations',
      icon: Calendar,
      onClick: onOpenTimetable,
    },
    {
      id: 'outing',
      label: 'Hostel Outing Pass',
      sublabel: 'MH-1 Room 705B',
      icon: Navigation,
      onClick: onOpenOuting,
    },
    {
      id: 'grades',
      label: 'Grade History & CGPA',
      sublabel: '134.0 Credits Completed',
      icon: Award,
      onClick: onOpenGrades,
    },
    {
      id: 'receipts',
      label: 'Fee Receipts',
      sublabel: 'Official tax vouchers',
      icon: CreditCard,
      onClick: onOpenReceipts,
    },
    {
      id: 'coursepage',
      label: 'Course Page',
      sublabel: 'Syllabus & Lecture Notes',
      icon: FolderGit2,
      onClick: onOpenCoursePage,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Quick Action Launchpad
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Frequent student services and instant requests
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {actions.map((act) => {
          const Icon = act.icon;

          return (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className="group p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-[#176CB8] hover:shadow-xs text-left flex flex-col justify-between min-h-[76px] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 text-[#176CB8] group-hover:bg-[#176CB8] group-hover:text-white group-hover:border-[#176CB8] flex items-center justify-center transition-all mb-2.5 shadow-2xs">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-[#176CB8] transition-colors leading-snug">
                  {act.label}
                </span>
                <span className="block text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                  {act.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
