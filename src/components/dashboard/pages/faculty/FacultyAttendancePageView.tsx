import React, { useState } from 'react';
import { PageBreadcrumbHeader } from '../PageBreadcrumbHeader';
import {
  MOCK_FACULTY_COURSES,
  MOCK_FACULTY_ATTENDANCE_STUDENTS,
} from '../../../../services/mockFacultyService';
import { FacultyStudentAttendanceItem } from '../../../../types/faculty';
import {
  CheckCircle2,
  Download,
  Search,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

interface FacultyAttendancePageViewProps {
  onBackToDashboard: () => void;
}

export const FacultyAttendancePageView: React.FC<FacultyAttendancePageViewProps> = ({
  onBackToDashboard,
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState('CSE4012');
  const [attendanceDate, setAttendanceDate] = useState('2026-09-14');
  const [sessionTopic, setSessionTopic] = useState("Usability Engineering & Fitts's Law in UI Systems");
  const [records, setRecords] = useState<FacultyStudentAttendanceItem[]>(
    MOCK_FACULTY_ATTENDANCE_STUDENTS
  );
  const [searchFilter, setSearchFilter] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeCourse =
    MOCK_FACULTY_COURSES.find((c) => c.code === selectedCourseCode) || MOCK_FACULTY_COURSES[0];

  const handleToggle = (regNo: string, nextStatus: 'Present' | 'Absent' | 'On-Duty') => {
    setRecords((prev) =>
      prev.map((item) => (item.regNo === regNo ? { ...item, status: nextStatus } : item))
    );
  };

  const handleMarkAllPresent = () => {
    setRecords((prev) => prev.map((item) => ({ ...item, status: 'Present' })));
    setStatusMessage('All students marked Present.');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleFinalize = () => {
    const present = records.filter((r) => r.status === 'Present').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const od = records.filter((r) => r.status === 'On-Duty').length;
    setStatusMessage(
      `Attendance saved and locked for ${activeCourse.code} on ${attendanceDate}: ${present} Present, ${absent} Absent, ${od} On-Duty.`
    );
    setTimeout(() => setStatusMessage(null), 6000);
  };

  const filteredRecords = records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.regNo.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageBreadcrumbHeader
        category="Instruction & Slots"
        title="Class Attendance Tracker & Ledger"
        subtitle="Mark Daily Attendance, Calculate Safe Margins, and View Attendance History"
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <button
            type="button"
            onClick={() => alert('Exporting attendance report as CSV...')}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
          >
            <Download className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* Control Strip (Course, Date, Slot, Topic) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label
              htmlFor="course-select"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Select Course & Slot
            </label>
            <select
              id="course-select"
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              className="w-full px-3 py-2 min-h-[44px] text-xs rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] font-bold"
            >
              {MOCK_FACULTY_COURSES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.title} ({c.slot})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="attendance-date"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Session Date
            </label>
            <input
              id="attendance-date"
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full px-3 py-2 min-h-[44px] text-xs rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
            />
          </div>

          <div>
            <label
              htmlFor="session-topic"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Lecture / Lab Topic Covered
            </label>
            <input
              id="session-topic"
              type="text"
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              className="w-full px-3 py-2 min-h-[44px] text-xs rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
            />
          </div>
        </div>

        {/* Status alert message */}
        {statusMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              Student Attendance Register ({filteredRecords.length} Students)
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#176CB8] font-bold">
              Slot: {activeCourse.slot}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter students..."
                className="w-full pl-9 pr-3 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="px-3.5 py-2 min-h-[44px] rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Mark All Present
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="py-2.5 px-3">Reg No & Name</th>
                <th scope="col" className="py-2.5 px-3 text-center">Attended / Total</th>
                <th scope="col" className="py-2.5 px-3 text-center">Current %</th>
                <th scope="col" className="py-2.5 px-3 text-center">Debar Risk</th>
                <th scope="col" className="py-2.5 px-3 text-right">Status for {attendanceDate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((stu) => {
                const isCritical = stu.attendancePercentage < 75;
                return (
                  <tr key={stu.regNo} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{stu.name}</div>
                      <div className="text-[11px] font-mono text-slate-500 font-medium">
                        {stu.regNo} • {stu.program}
                      </div>
                      {stu.remarks && (
                        <div className="text-[10px] text-amber-800 font-medium italic mt-0.5">
                          {stu.remarks}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-semibold tabular-nums">
                      {stu.attendedClasses} / {stu.totalClasses}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block font-mono font-bold px-2 py-0.5 rounded tabular-nums ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {stu.attendancePercentage.toFixed(1)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                          Debar Risk (&lt;75%)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-800">
                          Safe Margin
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggle(stu.regNo, 'Present')}
                          className={`px-3 py-1.5 min-h-[38px] rounded text-xs font-bold cursor-pointer active:scale-[0.97] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                            stu.status === 'Present'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(stu.regNo, 'Absent')}
                          className={`px-3 py-1.5 min-h-[38px] rounded text-xs font-bold cursor-pointer active:scale-[0.97] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 ${
                            stu.status === 'Absent'
                              ? 'bg-rose-700 text-white shadow-xs'
                              : 'text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(stu.regNo, 'On-Duty')}
                          className={`px-3 py-1.5 min-h-[38px] rounded text-xs font-bold cursor-pointer active:scale-[0.97] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                            stu.status === 'On-Duty'
                              ? 'bg-blue-700 text-white shadow-xs'
                              : 'text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          OD
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={handleFinalize}
            className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#183668] hover:bg-[#12284C] text-white text-xs font-bold cursor-pointer active:scale-[0.98] transition-all shadow-xs flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Lock & Submit Attendance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
