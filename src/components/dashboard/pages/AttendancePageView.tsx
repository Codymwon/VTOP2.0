import React, { useState } from 'react';
import { AttendanceRecord } from '../../../types/dashboard';
import { PageBreadcrumbHeader } from './PageBreadcrumbHeader';
import {
  CheckCircle2,
  AlertTriangle,
  Search,
  Calendar,
  MapPin,
  FileSpreadsheet,
  X,
  Calculator,
  ChevronRight,
} from 'lucide-react';

interface AttendancePageViewProps {
  records: AttendanceRecord[];
  onBackToDashboard: () => void;
}

export const AttendancePageView: React.FC<AttendancePageViewProps> = ({
  records,
  onBackToDashboard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'theory' | 'lab'>('all');
  const [selectedCourseForLog, setSelectedCourseForLog] = useState<AttendanceRecord | null>(records[0] || null);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);

  // Attendance Simulator State
  const [simMissClasses, setSimMissClasses] = useState<number>(1);

  // Close log modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLogDrawerOpen) {
        setIsLogDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogDrawerOpen]);

  // Summary Metrics
  const totalAttended = records.reduce((acc, r) => acc + r.attendedClasses, 0);
  const totalConducted = records.reduce((acc, r) => acc + r.totalClasses, 0);
  const overallPercentage = totalConducted > 0 ? ((totalAttended / totalConducted) * 100).toFixed(1) : '0';
  const debarredCount = records.filter((r) => r.attendancePercentage < 75).length;

  // Filtered Records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.facultyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedTypeFilter === 'all' ||
      (selectedTypeFilter === 'theory' && (r.courseType.includes('Theory') || r.courseType.includes('TH'))) ||
      (selectedTypeFilter === 'lab' && (r.courseType.includes('Lab') || r.courseType.includes('ELA')));

    return matchesSearch && matchesType;
  });

  const handleOpenCourseLog = (record: AttendanceRecord) => {
    setSelectedCourseForLog(record);
    setIsLogDrawerOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Page Header */}
      <PageBreadcrumbHeader
        category="Academics"
        title="Class Attendance Records"
        subtitle="Course-wise biometric attendance, debar threshold safety margins, and date-wise audit logs."
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl">
            Institutional Policy: 75% Min. Debar Threshold
          </span>
        }
      />

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Attendance</div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
              {overallPercentage}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Safe
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            {totalAttended} attended of {totalConducted} classes
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses Enrolled</div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
              {records.length}
            </span>
            <span className="text-xs text-slate-500">Components</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Theory & Lab components tracked
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Debar Status</div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tabular-nums">
              0
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              All Clear
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            {debarredCount > 0 ? `${debarredCount} courses at risk` : 'No courses below 75% threshold'}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Biometric Sync</div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#176CB8] font-mono tabular-nums">
              Live
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Synchronized with classroom sensors
          </div>
        </div>
      </div>

      {/* Simulator / Margin Quick Tool */}
      <div className="bg-linear-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
              <h2 className="text-sm font-bold text-slate-900">
                Attendance Margin Projection Calculator
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl">
              Calculate projected attendance percentage if you miss upcoming classes for any registered course.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">If I miss:</span>
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSimMissClasses(num)}
                  className={`px-3 py-1.5 min-h-[36px] text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer ${
                    simMissClasses === num
                      ? 'bg-[#176CB8] text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {num} {num === 1 ? 'class' : 'classes'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
          <input
            type="text"
            aria-label="Search by course code, title, or faculty"
            placeholder="Search by course code, title, or faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] pl-9.5 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:bg-white text-slate-900 transition-all placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Filter Type:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-3.5 py-2 min-h-[40px] text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedTypeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('theory')}
              className={`px-3.5 py-2 min-h-[40px] text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedTypeFilter === 'theory'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Theory Only
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('lab')}
              className={`px-3.5 py-2 min-h-[40px] text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedTypeFilter === 'lab'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lab Components
            </button>
          </div>
        </div>
      </div>

      {/* Main Course-wise Attendance Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" aria-label="Course-wise Attendance Register">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-4 w-12 text-center">#</th>
                <th scope="col" className="py-3.5 px-4 min-w-[200px]">Course Code & Title</th>
                <th scope="col" className="py-3.5 px-4 min-w-[130px]">Type / Slot / Venue</th>
                <th scope="col" className="py-3.5 px-4 min-w-[160px]">Faculty</th>
                <th scope="col" className="py-3.5 px-4 text-center min-w-[110px]">Attended / Total</th>
                <th scope="col" className="py-3.5 px-4 min-w-[150px]">Attendance %</th>
                <th scope="col" className="py-3.5 px-4 text-center min-w-[100px]">Margin (75%)</th>
                <th scope="col" className="py-3.5 px-4 text-right min-w-[130px]">Detailed Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r, idx) => {
                const projectedTotal = r.totalClasses + simMissClasses;
                const projectedPct = Math.round((r.attendedClasses / projectedTotal) * 100);

                return (
                  <tr
                    key={r.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                      {idx + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-mono tracking-tight">
                        {r.courseCode}
                      </div>
                      <div className="text-slate-600 font-medium line-clamp-1">
                        {r.courseTitle}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                        {r.courseType}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                        <span>{r.slot}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 text-slate-700">
                          <MapPin className="w-3 h-3 text-slate-500" aria-hidden="true" />
                          {r.venue}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {r.facultyName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {r.facultySchool}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                        {r.attendedClasses} / {r.totalClasses}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {r.totalClasses - r.attendedClasses} missed
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                        <span className={r.attendancePercentage >= 85 ? 'text-emerald-700' : r.attendancePercentage >= 75 ? 'text-amber-700' : 'text-rose-700'}>
                          {r.attendancePercentage}%
                        </span>
                        {simMissClasses > 0 && (
                          <span className="text-[10px] text-slate-500">
                            Proj: <strong className="font-mono text-slate-700">{projectedPct}%</strong>
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            r.attendancePercentage >= 85
                              ? 'bg-emerald-500'
                              : r.attendancePercentage >= 75
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${r.attendancePercentage}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {r.safeClassesToMiss > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                          <span>{r.safeClassesToMiss} safe</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" aria-hidden="true" />
                          <span>0 buffer</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenCourseLog(r)}
                        aria-label={`View detailed attendance log for ${r.courseCode}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-[#176CB8] bg-blue-50/70 hover:bg-blue-100 border border-blue-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>View Log</span>
                        <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Date-wise Detailed Attendance Log Drawer / Modal */}
      {isLogDrawerOpen && selectedCourseForLog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="attendance-course-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-[#176CB8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedCourseForLog.courseCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {selectedCourseForLog.courseType}
                  </span>
                </div>
                <h3 id="attendance-course-title" className="text-base sm:text-lg font-bold text-slate-900">
                  {selectedCourseForLog.courseTitle}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                  <span>Faculty: <strong>{selectedCourseForLog.facultyName}</strong></span>
                  <span>·</span>
                  <span>Slot: <strong>{selectedCourseForLog.slot}</strong></span>
                  <span>·</span>
                  <span>Venue: <strong>{selectedCourseForLog.venue}</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLogDrawerOpen(false)}
                aria-label="Close detailed attendance log"
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Course Log Attendance Strip */}
            <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-slate-500">Total Classes:</span>{' '}
                  <strong className="font-mono text-slate-900">{selectedCourseForLog.totalClasses}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Attended:</span>{' '}
                  <strong className="font-mono text-emerald-700">{selectedCourseForLog.attendedClasses}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Missed:</span>{' '}
                  <strong className="font-mono text-rose-700">{selectedCourseForLog.totalClasses - selectedCourseForLog.attendedClasses}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Score:</span>
                <span className="font-mono font-bold text-sm text-[#176CB8] bg-white px-2 py-0.5 rounded border border-blue-200">
                  {selectedCourseForLog.attendancePercentage}%
                </span>
              </div>
            </div>

            {/* Date-wise Log Table */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {selectedCourseForLog.dayLogs && selectedCourseForLog.dayLogs.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse" aria-label="Date-wise Punch Log Table">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <th scope="col" className="py-2.5 px-3 w-12 text-center">#</th>
                        <th scope="col" className="py-2.5 px-3 min-w-[110px]">Date</th>
                        <th scope="col" className="py-2.5 px-3">Slot</th>
                        <th scope="col" className="py-2.5 px-3">Day & Time</th>
                        <th scope="col" className="py-2.5 px-3 text-center">Status</th>
                        <th scope="col" className="py-2.5 px-3">Audit Remark / Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {selectedCourseForLog.dayLogs.map((log) => (
                        <tr
                          key={log.slNo}
                          className={log.status === 'Absent' ? 'bg-rose-50/40' : 'hover:bg-slate-50'}
                        >
                          <td className="py-2.5 px-3 text-center text-slate-500 font-medium">
                            {log.slNo}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {log.date}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {log.slot}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {log.dayTime}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {log.status === 'Present' ? (
                              <span className="inline-flex items-center gap-1 font-sans text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-2.5 h-2.5" aria-hidden="true" />
                                Present
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-sans text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                <AlertTriangle className="w-2.5 h-2.5" aria-hidden="true" />
                                Absent
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-sans text-xs text-slate-600">
                            {log.remark ? (
                              <span className="text-rose-700 font-medium">{log.remark}</span>
                            ) : (
                              <span className="text-slate-500">Class punch validated</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center space-y-2">
                  <FileSpreadsheet className="w-8 h-8 text-slate-500 mx-auto" aria-hidden="true" />
                  <p className="text-sm font-semibold text-slate-700">Detailed punch history being synchronized</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Biometric punch timestamps for this specific component will be rendered after the evening academic server sync.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Biometric source: Classroom AB1 Fingerprint & RFID reader</span>
              <button
                type="button"
                onClick={() => setIsLogDrawerOpen(false)}
                className="px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
