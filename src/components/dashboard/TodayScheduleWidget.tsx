import React from 'react';
import { TodayClassSlot } from '../../types/dashboard';
import { Clock, MapPin, User, ChevronRight, CheckCircle2, PlayCircle, Calendar } from 'lucide-react';

interface TodayScheduleWidgetProps {
  schedule: TodayClassSlot[];
  onOpenFullTimetable: () => void;
}

export const TodayScheduleWidget: React.FC<TodayScheduleWidgetProps> = ({
  schedule,
  onOpenFullTimetable,
}) => {
  const ongoingClass = schedule.find((s) => s.status === 'ongoing');

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#176CB8]" />
            <h2 className="text-sm font-bold text-slate-900">
              Today&apos;s Class Schedule
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            5 Lectures Scheduled • Day Order 4
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenFullTimetable}
          className="text-xs font-bold text-[#176CB8] hover:text-[#2455A3] hover:underline flex items-center gap-1 min-h-[44px] px-2.5 py-1.5 rounded-lg active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
        >
          <span>Weekly Grid</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary Highlight: Ongoing / Next Class Callout */}
      {ongoingClass && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50/40 to-white border border-blue-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Lecture In Progress
            </span>
            <span className="text-xs font-bold text-slate-700 tabular-nums">
              {ongoingClass.startTime} - {ongoingClass.endTime}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {ongoingClass.courseCode}: {ongoingClass.courseTitle}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  {ongoingClass.facultyName} ({ongoingClass.facultySchool})
                </span>
                <span className="flex items-center gap-1 font-semibold text-blue-900 bg-white/90 px-2 py-0.5 rounded-md border border-blue-200/70 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-[#176CB8]" aria-hidden="true" />
                  Room {ongoingClass.venue}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-[#176CB8] text-white text-xs font-bold tracking-wide shadow-2xs">
                {ongoingClass.slot}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Timeline of All Today's Classes */}
      <div className="space-y-2">
        {schedule.map((item) => {
          const isOngoing = item.status === 'ongoing';
          const isCompleted = item.status === 'completed';

          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                isOngoing
                  ? 'bg-blue-50/50 border-blue-200/90 shadow-2xs'
                  : isCompleted
                  ? 'bg-slate-50/60 border-slate-100 opacity-80'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Left: Time & Slot */}
              <div className="flex items-center gap-2.5 min-w-[125px] shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                ) : isOngoing ? (
                  <PlayCircle className="w-4 h-4 text-[#176CB8] shrink-0" aria-hidden="true" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                )}

                <div>
                  <span className="font-bold text-slate-900 block tabular-nums">
                    {item.startTime}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Slot {item.slot}
                  </span>
                </div>
              </div>

              {/* Center: Title & Faculty */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">
                  {item.courseCode} - {item.courseTitle}
                </p>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {item.facultyName}
                </p>
              </div>

              {/* Right: Venue Room Number */}
              <div className="shrink-0 text-right">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200/80 block tabular-nums">
                  {item.venue}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                  {item.courseType}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
