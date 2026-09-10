import React from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { MOCK_ATTENDANCE_RECORDS } from '../../services/mockDashboardService';

interface TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimetableModal: React.FC<TimetableModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="timetable-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#176CB8] border border-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 id="timetable-modal-title" className="text-base font-bold text-slate-900">
                Weekly Class Timetable & Room Matrix
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Fall Semester 2026-27 • 21.0 Total Registered Credits
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Timetable"
            className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Course Allocation Table */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse" aria-label="Course Allocation Timetable">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th scope="col" className="p-2.5">Course Code & Title</th>
                  <th scope="col" className="p-2.5">Type</th>
                  <th scope="col" className="p-2.5 font-mono">Slot</th>
                  <th scope="col" className="p-2.5">Room</th>
                  <th scope="col" className="p-2.5">Faculty Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_ATTENDANCE_RECORDS.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-2.5 font-medium text-slate-900">
                      <span className="font-mono font-bold text-[#176CB8] mr-1.5">{item.courseCode}</span>
                      {item.courseTitle}
                    </td>
                    <td className="p-2.5 text-slate-600">{item.courseType}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-800">{item.slot}</td>
                    <td className="p-2.5 font-mono font-semibold text-blue-900">{item.venue}</td>
                    <td className="p-2.5 text-slate-600">{item.facultyName} ({item.facultySchool})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Theory / Lab Timing Guide */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-[#176CB8] flex items-center gap-1.5">
              <Clock className="w-4 h-4" aria-hidden="true" /> Theory & Lab Slot Intervals:
            </p>
            <p className="text-[11px] text-slate-600">
              • Morning Theory: 08:00 AM to 01:00 PM | Afternoon Theory: 02:00 PM to 07:00 PM
            </p>
            <p className="text-[11px] text-slate-600">
              • Morning Lab: 08:00 AM to 11:30 AM | Afternoon Lab: 02:00 PM to 05:30 PM
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 min-h-[44px] bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
          >
            Close Timetable
          </button>
        </div>
      </div>
    </div>
  );
};
