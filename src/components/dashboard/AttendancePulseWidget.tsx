import React, { useState } from 'react';
import { AttendanceRecord } from '../../types/dashboard';
import { ShieldCheck, ChevronRight, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';

interface AttendancePulseWidgetProps {
  records: AttendanceRecord[];
  onOpenFullAttendance: () => void;
}

export const AttendancePulseWidget: React.FC<AttendancePulseWidgetProps> = ({
  records,
  onOpenFullAttendance,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedRecords = isExpanded ? records : records.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Attendance & Margin Pulse
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Institutional 75% minimum debarment threshold
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenFullAttendance}
          className="text-xs font-bold text-[#176CB8] hover:text-[#2455A3] hover:underline flex items-center gap-1 min-h-[40px] px-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
        >
          <span>Full Details</span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Courses List */}
      <div className="space-y-3">
        {displayedRecords.map((rec) => {
          const isFull = rec.attendancePercentage === 100;
          const isSafe = rec.attendancePercentage >= 85;
          const isCaution = rec.attendancePercentage >= 75 && rec.attendancePercentage < 85;
          const isDanger = rec.attendancePercentage < 75;

          const barColor = isFull
            ? 'bg-emerald-500'
            : isSafe
            ? 'bg-[#176CB8]'
            : isCaution
            ? 'bg-amber-500'
            : 'bg-rose-500';

          return (
            <div key={rec.id} className="group p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold text-slate-900 shrink-0 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80 tabular-nums">
                    {rec.courseCode}
                  </span>
                  <span className="text-slate-700 truncate font-semibold">
                    {rec.courseTitle} <span className="text-slate-500 font-normal">({rec.courseType.includes('Lab') ? 'Lab' : 'Theory'})</span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[11px] text-slate-500 font-medium tabular-nums">
                    {rec.attendedClasses}/{rec.totalClasses}
                  </span>
                  <span
                    className={`font-bold text-xs tabular-nums min-w-[34px] text-right ${
                      isDanger ? 'text-rose-600' : isCaution ? 'text-amber-700' : 'text-slate-900'
                    }`}
                  >
                    {rec.attendancePercentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar with 75% Marker */}
              <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                {/* 75% threshold guide line */}
                <div
                  className="absolute top-0 bottom-0 left-[75%] w-[1.5px] bg-slate-300 z-10"
                  title="75% Debarment Threshold"
                />
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                  style={{ width: `${Math.min(100, rec.attendancePercentage)}%` }}
                />
              </div>

              {/* Margin Notice Tag */}
              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium tabular-nums">
                  Slot: {rec.slot} • Room {rec.venue}
                </span>

                {isDanger ? (
                  <span className="font-bold text-rose-700 flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                    Debarred: need {rec.classesNeededFor75} classes
                  </span>
                ) : rec.safeClassesToMiss > 0 ? (
                  <span className="font-semibold text-emerald-700 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                    Can miss {rec.safeClassesToMiss} {rec.safeClassesToMiss === 1 ? 'class' : 'classes'}
                  </span>
                ) : (
                  <span className="font-semibold text-amber-700 text-[11px]">
                    Margin tight: attend next class
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand / Collapse Toggle for Height Balance */}
      {records.length > 5 && (
        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="w-full py-2 min-h-[44px] text-xs font-semibold text-slate-600 hover:text-[#176CB8] hover:bg-slate-50 rounded-xl transition-all flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
          >
            <span>{isExpanded ? 'Show Primary Courses (5)' : `Show All ${records.length} Courses (+${records.length - 5} more)`}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
