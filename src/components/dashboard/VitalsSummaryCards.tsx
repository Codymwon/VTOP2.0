import React from 'react';
import { AcademicKPIs } from '../../types/dashboard';
import { ShieldCheck, Award, BookOpen, Layers } from 'lucide-react';

interface VitalsSummaryCardsProps {
  kpis: AcademicKPIs;
  onNavigateToAttendance: () => void;
  onNavigateToGrades: () => void;
  onNavigateToCourses: () => void;
}

export const VitalsSummaryCards: React.FC<VitalsSummaryCardsProps> = ({
  kpis,
  onNavigateToAttendance,
  onNavigateToGrades,
  onNavigateToCourses,
}) => {
  return (
    <section aria-label="Academic Vitals Overview" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Overall Attendance Card */}
      <div
        role="button"
        tabIndex={0}
        onClick={onNavigateToAttendance}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNavigateToAttendance();
          }
        }}
        className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#176CB8]/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-600">Overall Attendance</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#176CB8] border border-blue-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums tracking-tight">
              {kpis.overallAttendancePercentage}%
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Safe Margin
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {kpis.totalAttendedClasses} of {kpis.totalConductedClasses} classes attended
          </p>
        </div>
      </div>

      {/* 2. Cumulative CGPA Card */}
      <div
        role="button"
        tabIndex={0}
        onClick={onNavigateToGrades}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNavigateToGrades();
          }
        }}
        className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-400/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-600">Cumulative CGPA</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <Award className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums tracking-tight">
              {kpis.cgpa.toFixed(2)}
            </span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Honors Standing
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {kpis.totalEarnedCredits} total credits completed
          </p>
        </div>
      </div>

      {/* 3. Semester Load Card */}
      <div
        role="button"
        tabIndex={0}
        onClick={onNavigateToCourses}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNavigateToCourses();
          }
        }}
        className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-600">Current Semester</span>
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#3497DB] border border-sky-100 flex items-center justify-center shrink-0">
            <BookOpen className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums tracking-tight">
              {kpis.currentSemesterCredits}.0
            </span>
            <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              Credits Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Registered and invoice confirmed
          </p>
        </div>
      </div>

      {/* 4. Enrolled Courses Count */}
      <div
        role="button"
        tabIndex={0}
        onClick={onNavigateToCourses}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNavigateToCourses();
          }
        }}
        className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-600">Enrolled Courses</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
            <Layers className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums tracking-tight">
              {kpis.enrolledSubjectsCount}
            </span>
            <span className="text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              {kpis.enrolledComponentsCount} Modules
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Theory, Lab, and Embedded Project
          </p>
        </div>
      </div>
    </section>
  );
};
