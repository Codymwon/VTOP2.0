import React from 'react';
import { X, ShieldCheck, CheckCircle2, Download } from 'lucide-react';
import { MOCK_ATTENDANCE_RECORDS, MOCK_ACADEMIC_KPIS } from '../../services/mockDashboardService';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="attendance-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="attendance-modal-title" className="text-base font-bold text-slate-900">
                Official Course Attendance Register
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Overall: {MOCK_ACADEMIC_KPIS.overallAttendancePercentage}% • {MOCK_ACADEMIC_KPIS.totalAttendedClasses}/{MOCK_ACADEMIC_KPIS.totalConductedClasses} Attended
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Attendance View"
            className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Table Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse" aria-label="Student Attendance Summary Table">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th scope="col" className="p-2.5">Course Code & Title</th>
                  <th scope="col" className="p-2.5">Type</th>
                  <th scope="col" className="p-2.5 font-mono">Slot</th>
                  <th scope="col" className="p-2.5 text-center">Attended / Total</th>
                  <th scope="col" className="p-2.5 text-center">Percentage</th>
                  <th scope="col" className="p-2.5 text-center">Debar Status</th>
                  <th scope="col" className="p-2.5 text-right">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {MOCK_ATTENDANCE_RECORDS.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-2.5 text-slate-900">
                      <span className="font-mono font-bold text-[#176CB8] mr-1.5">{rec.courseCode}</span>
                      {rec.courseTitle}
                      <span className="block text-[11px] text-slate-500">{rec.facultyName} ({rec.facultySchool})</span>
                    </td>
                    <td className="p-2.5 text-slate-600">{rec.courseType}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-800">{rec.slot}</td>
                    <td className="p-2.5 text-center font-mono font-semibold text-slate-700">
                      {rec.attendedClasses} / {rec.totalClasses}
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-xs text-slate-900">
                      {rec.attendancePercentage}%
                    </td>
                    <td className="p-2.5 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Clear
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-semibold text-emerald-700">
                      Can miss {rec.safeClassesToMiss}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            Note: As per university norms, Virtual Slots & Medical Leave are calculated in accordance with institutional policy. A minimum of 75% attendance is required to sit for Final Assessment Tests (FAT).
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          <button
            type="button"
            onClick={() => alert('Attendance report exported as PDF!')}
            className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Export Summary</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 min-h-[44px] bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
