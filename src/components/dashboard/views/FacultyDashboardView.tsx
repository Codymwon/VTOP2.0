import React, { useState } from 'react';
import {
  MOCK_FACULTY_KPIS,
  MOCK_FACULTY_TODAY_SLOTS,
  MOCK_FACULTY_ATTENDANCE_STUDENTS,
  MOCK_FACULTY_PENDING_GRADING,
  MOCK_FACULTY_INVIGILATIONS,
  MOCK_FACULTY_ADVISEES,
} from '../../../services/mockFacultyService';
import {
  FacultyStudentAttendanceItem,
  PendingGradingItem,
  FacultyTodaySlot,
} from '../../../types/faculty';
import {
  BookOpen,
  Users,
  GraduationCap,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  ChevronRight,
  FileCheck,
  Send,
  X,
  UserCheck,
} from 'lucide-react';

interface FacultyDashboardViewProps {
  onNavigateTo: (sectionId: string) => void;
}

export const FacultyDashboardView: React.FC<FacultyDashboardViewProps> = ({ onNavigateTo }) => {
  // Active slot selection for attendance marking widget
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-c1');
  const [attendanceRecords, setAttendanceRecords] = useState<FacultyStudentAttendanceItem[]>(
    MOCK_FACULTY_ATTENDANCE_STUDENTS
  );
  const [attendanceSavedMessage, setAttendanceSavedMessage] = useState<string | null>(null);

  // Quick Attendance Modal state
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [modalSlot, setModalSlot] = useState<FacultyTodaySlot>(MOCK_FACULTY_TODAY_SLOTS[0]);

  // Grading Queue state
  const [gradingQueue, setGradingQueue] = useState<PendingGradingItem[]>(
    MOCK_FACULTY_PENDING_GRADING
  );
  const [gradingItem, setGradingItem] = useState<PendingGradingItem | null>(null);
  const [gradeInput, setGradeInput] = useState<string>('');
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [gradingSuccessMessage, setGradingSuccessMessage] = useState<string | null>(null);

  // Advisee Quick Approval state
  const [advisees, setAdvisees] = useState(MOCK_FACULTY_ADVISEES);
  const [adviseeActionNotice, setAdviseeActionNotice] = useState<string | null>(null);

  const activeSlot =
    MOCK_FACULTY_TODAY_SLOTS.find((s) => s.id === selectedSlotId) || MOCK_FACULTY_TODAY_SLOTS[0];

  // Attendance Toggle handler
  const handleToggleAttendance = (regNo: string, nextStatus: 'Present' | 'Absent' | 'On-Duty') => {
    setAttendanceRecords((prev) =>
      prev.map((item) => (item.regNo === regNo ? { ...item, status: nextStatus } : item))
    );
  };

  // Mark all students present
  const handleMarkAllPresent = () => {
    setAttendanceRecords((prev) =>
      prev.map((item) => ({ ...item, status: 'Present' }))
    );
    setAttendanceSavedMessage('All 8 students in roster marked Present.');
    setTimeout(() => setAttendanceSavedMessage(null), 3500);
  };

  // Finalize & save attendance
  const handleSaveAttendance = () => {
    const presentCount = attendanceRecords.filter((r) => r.status === 'Present').length;
    const absentCount = attendanceRecords.filter((r) => r.status === 'Absent').length;
    const odCount = attendanceRecords.filter((r) => r.status === 'On-Duty').length;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendanceSavedMessage(
      `Attendance locked at ${timestamp} for ${activeSlot.courseCode} (${activeSlot.slot}): ${presentCount} Present, ${absentCount} Absent, ${odCount} On-Duty.`
    );
    setTimeout(() => setAttendanceSavedMessage(null), 6000);
  };

  // Grading Submit handler
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingItem) return;
    const scoreNum = parseFloat(gradeInput);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > gradingItem.maxMarks) {
      alert(`Please enter a valid score between 0 and ${gradingItem.maxMarks}`);
      return;
    }

    setGradingQueue((prev) =>
      prev.map((item) =>
        item.id === gradingItem.id
          ? { ...item, status: 'Graded', score: scoreNum, feedback: feedbackInput }
          : item
      )
    );
    setGradingSuccessMessage(
      `Saved score ${scoreNum}/${gradingItem.maxMarks} for ${gradingItem.studentName} (${gradingItem.studentRegNo}).`
    );
    setGradingItem(null);
    setGradeInput('');
    setFeedbackInput('');
    setTimeout(() => setGradingSuccessMessage(null), 5000);
  };

  // Mentor Quick Outing Approval
  const handleApproveAdviseeLeave = (leaveId: string, studentName: string) => {
    setAdvisees((prev) =>
      prev.map((adv) => ({
        ...adv,
        pendingLeaveRequests: adv.pendingLeaveRequests.filter((r) => r.id !== leaveId),
      }))
    );
    setAdviseeActionNotice(
      `Weekend Outing request for ${studentName} verified and forwarded to Hostel Warden Desk.`
    );
    setTimeout(() => setAdviseeActionNotice(null), 5000);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Live Accessibility Status Region */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {attendanceSavedMessage || gradingSuccessMessage || adviseeActionNotice || ''}
      </div>

      {/* 1. Live Class Slot Header Banner */}
      <section
        aria-label="Live Class Session Status"
        className="rounded-2xl bg-gradient-to-r from-[#183668] via-[#1B4F72] to-[#0D5C75] text-white p-4 sm:p-5 shadow-sm border border-cyan-800/40 relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                Live Teaching Session Active
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/10 text-cyan-200 border border-white/15">
                Slot {activeSlot.slot}
              </span>
              <span className="text-xs font-medium text-cyan-100/80">
                {activeSlot.startTime} – {activeSlot.endTime}
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {activeSlot.courseCode} • {activeSlot.courseTitle}
              </h2>
              <p className="text-xs sm:text-sm text-cyan-100/90 flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-white">Room {activeSlot.room}</span>
                <span className="text-cyan-300">•</span>
                <span>{activeSlot.enrolledCount} Students Enrolled</span>
                <span className="text-cyan-300">•</span>
                <span className="italic">{activeSlot.topic}</span>
              </p>
            </div>
          </div>

          {/* Quick Action: Mark Attendance Drawer Trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setModalSlot(activeSlot);
                setIsAttendanceModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-300"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" aria-hidden="true" />
              <span>Mark Slot Attendance</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTo('facultycourses')}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Course Syllabus</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-200" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Faculty Academic KPI Bar (High-Density Cockpit) */}
      <section aria-label="Faculty Academic KPIs" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Courses */}
        <button
          type="button"
          onClick={() => onNavigateTo('facultycourses')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 hover:border-[#176CB8] hover:shadow-xs transition-all text-left flex flex-col justify-between min-h-[102px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Assigned Courses
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#176CB8] flex items-center justify-center">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {MOCK_FACULTY_KPIS.activeCoursesCount}
            </span>
            <span className="text-xs text-slate-500 font-medium ml-2">
              ({MOCK_FACULTY_KPIS.totalCredits} Credits)
            </span>
          </div>
        </button>

        {/* Total Enrolled Students */}
        <button
          type="button"
          onClick={() => onNavigateTo('facultyattendance')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 hover:border-[#176CB8] hover:shadow-xs transition-all text-left flex flex-col justify-between min-h-[102px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {MOCK_FACULTY_KPIS.totalStudentsEnrolled}
            </span>
            <span className="text-xs text-teal-700 font-semibold ml-2">
              Across 3 Course Slots
            </span>
          </div>
        </button>

        {/* Submissions Pending Evaluation */}
        <button
          type="button"
          onClick={() => onNavigateTo('facultygrading')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 hover:border-amber-500 hover:shadow-xs transition-all text-left flex flex-col justify-between min-h-[102px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pending Grading
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-black text-amber-800 tabular-nums">
              {MOCK_FACULTY_KPIS.pendingGradingCount}
            </span>
            <span className="text-xs text-amber-700 font-bold ml-2">
              DA & CAT Submissions
            </span>
          </div>
        </button>

        {/* Proctor Students */}
        <button
          type="button"
          onClick={() => onNavigateTo('facultyproctor')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 hover:border-rose-500 hover:shadow-xs transition-all text-left flex flex-col justify-between min-h-[102px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Proctor Advisees
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {MOCK_FACULTY_KPIS.proctorAdviseesCount}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {MOCK_FACULTY_KPIS.academicAlertsCount} on Alert
            </span>
          </div>
        </button>
      </section>

      {/* Advisee Attention Alert (if pending leave or academic alert exists) */}
      {advisees.some((a) => a.pendingLeaveRequests.length > 0) && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Mentor Attention Required
              </span>
              <p className="text-xs text-amber-900 font-medium">
                Advisee <strong>Arjun K Sharma (23BCE1088)</strong> requested Weekend Outing to Hyderabad (Parent consent verified).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleApproveAdviseeLeave('leave-arj-01', 'Arjun K Sharma')}
              className="px-3.5 py-2 min-h-[44px] rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-900"
            >
              Approve Outing
            </button>
            <button
              type="button"
              onClick={() => onNavigateTo('facultyproctor')}
              className="px-3.5 py-2 min-h-[44px] rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
            >
              View Advisees
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Multi-Column Cockpit (Quick Attendance Widget + Pending Grading Queue) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column (7 cols): Quick Attendance Marking Widget */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Quick Attendance Ledger
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 tabular-nums">
                    Today: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time class attendance marker. 1-click status updates with automatic safe-margin calculation.
                </p>
              </div>

              {/* Slot Switcher Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                {MOCK_FACULTY_TODAY_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#176CB8] ${
                      selectedSlotId === slot.id
                        ? 'bg-white text-[#183668] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {slot.courseCode} ({slot.slot})
                  </button>
                ))}
              </div>
            </div>

            {/* Attendance Roster Table */}
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th scope="col" className="py-2.5 px-3">Student</th>
                    <th scope="col" className="py-2.5 px-3 text-center">Semester %</th>
                    <th scope="col" className="py-2.5 px-3 text-right">Attendance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceRecords.map((stu) => {
                    const isBelow75 = stu.attendancePercentage < 75;
                    return (
                      <tr key={stu.regNo} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{stu.name}</div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {stu.regNo} • {stu.program}
                          </div>
                          {stu.remarks && (
                            <div className="text-[10px] text-amber-700 italic mt-0.5">
                              Note: {stu.remarks}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block font-mono font-bold px-2 py-0.5 rounded ${
                              isBelow75
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {stu.attendancePercentage.toFixed(1)}%
                          </span>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {stu.attendedClasses}/{stu.totalClasses} classes
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg gap-1">
                            <button
                              type="button"
                              onClick={() => handleToggleAttendance(stu.regNo, 'Present')}
                              className={`px-2.5 py-1.5 min-h-[38px] rounded-md text-[11px] font-bold transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                                stu.status === 'Present'
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleAttendance(stu.regNo, 'Absent')}
                              className={`px-2.5 py-1.5 min-h-[38px] rounded-md text-[11px] font-bold transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 ${
                                stu.status === 'Absent'
                                  ? 'bg-rose-700 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleAttendance(stu.regNo, 'On-Duty')}
                              className={`px-2.5 py-1.5 min-h-[38px] rounded-md text-[11px] font-bold transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
                                stu.status === 'On-Duty'
                                  ? 'bg-blue-700 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
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

            {/* Attendance Actions Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="w-full sm:w-auto px-4 py-2 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Mark All Present
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="w-full sm:w-auto px-4 py-2 min-h-[44px] rounded-xl bg-[#183668] hover:bg-[#12284C] text-white text-xs font-bold transition-all active:scale-[0.98] shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#176CB8]"
                >
                  Save & Finalize Attendance
                </button>
              </div>
            </div>

            {attendanceSavedMessage && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>{attendanceSavedMessage}</span>
              </div>
            )}
          </div>

          {/* Invigilation & Exam Duties Widget */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-900">
                  Upcoming Exam Invigilation Schedule
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTo('facultyduties')}
                className="text-xs font-semibold text-[#176CB8] hover:underline"
              >
                View Full Duties
              </button>
            </div>

            <div className="space-y-2.5">
              {MOCK_FACULTY_INVIGILATIONS.map((duty) => (
                <div
                  key={duty.id}
                  className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {duty.courseCode} • {duty.courseTitle}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {duty.examType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                        {duty.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                        {duty.session}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                        {duty.hall}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Reporting: <span className="font-semibold text-slate-700">{duty.reportingTime}</span> • Chief Supdt: {duty.chiefSuperintendent}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                      Duty Assigned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Pending Evaluation & Grading Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <span>Pending Grading Queue</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submissions awaiting marks entry & feedback.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                {gradingQueue.filter((g) => g.status === 'Pending').length} Pending
              </span>
            </div>

            {gradingSuccessMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>{gradingSuccessMessage}</span>
              </div>
            )}

            <div className="space-y-3">
              {gradingQueue.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all ${
                    item.status === 'Graded'
                      ? 'bg-slate-50/50 border-slate-200 opacity-75'
                      : 'bg-white border-slate-200/90 hover:border-amber-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {item.courseCode}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          {item.componentType}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.studentName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          ({item.studentRegNo})
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">
                        {item.assignmentTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        File: {item.fileDetails}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Max Marks
                      </span>
                      <span className="text-sm font-black text-slate-900 tabular-nums">
                        {item.status === 'Graded' ? `${item.score} / ${item.maxMarks}` : `${item.maxMarks}`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      Due: <strong>{item.dueDate}</strong>
                    </span>

                    {item.status === 'Graded' ? (
                      <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Graded
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setGradingItem(item);
                          setGradeInput('');
                          setFeedbackInput('');
                        }}
                        className="px-3.5 py-2 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                      >
                        Quick Grade
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateTo('facultygrading')}
                className="w-full py-2.5 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Open Full Evaluation Portal</span>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Grade Modal Dialog */}
      {gradingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            role="presentation"
            onClick={() => setGradingItem(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          <div
            role="dialog"
            aria-labelledby="grading-modal-title"
            aria-modal="true"
            className="relative z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 id="grading-modal-title" className="text-sm font-bold text-slate-900">
                  Grade Submission: {gradingItem.studentName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {gradingItem.studentRegNo} • {gradingItem.courseCode} ({gradingItem.componentType})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGradingItem(null)}
                aria-label="Close grading dialog"
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] active:scale-[0.98] transition-all"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="font-semibold text-slate-800">{gradingItem.assignmentTitle}</div>
              <div className="text-slate-500">Submitted File: {gradingItem.fileDetails}</div>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-3">
              <div>
                <label
                  htmlFor="marks-input"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Marks Scored (Max: {gradingItem.maxMarks})
                </label>
                <input
                  id="marks-input"
                  type="number"
                  step="0.5"
                  min="0"
                  max={gradingItem.maxMarks}
                  required
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  placeholder={`0 - ${gradingItem.maxMarks}`}
                  className="w-full min-h-[44px] px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] font-mono font-bold"
                />
              </div>

              <div>
                <label
                  htmlFor="feedback-input"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Instructor Feedback (Optional)
                </label>
                <textarea
                  id="feedback-input"
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="e.g. Excellent heuristic analysis. Fitts's law calculations well articulated."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGradingItem(null)}
                  className="px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 min-h-[44px] rounded-xl bg-[#183668] hover:bg-[#12284C] active:scale-[0.98] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Submit Marks</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Mark Attendance Modal (from Header Banner) */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            role="presentation"
            onClick={() => setIsAttendanceModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          <div
            role="dialog"
            aria-labelledby="attendance-modal-title"
            aria-modal="true"
            className="relative z-50 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div>
                <h3 id="attendance-modal-title" className="text-sm font-bold text-slate-900">
                  Mark Attendance: {modalSlot.courseCode} ({modalSlot.slot})
                </h3>
                <p className="text-xs text-slate-500">
                  Room {modalSlot.room} • {modalSlot.startTime} - {modalSlot.endTime} • {attendanceRecords.length} Students in Roster
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAttendanceModalOpen(false)}
                aria-label="Close dialog"
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-700">Student Attendance List</span>
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="px-3 py-2 min-h-[38px] text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  Mark All Present
                </button>
              </div>

              {attendanceRecords.map((stu) => (
                <div
                  key={stu.regNo}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{stu.name}</div>
                    <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                      {stu.regNo} • Attendance: {stu.attendancePercentage.toFixed(1)}%
                    </div>
                  </div>

                  <div className="inline-flex items-center p-0.5 bg-slate-200/70 rounded-lg gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleAttendance(stu.regNo, 'Present')}
                      className={`px-2.5 py-1.5 min-h-[36px] rounded text-xs font-bold cursor-pointer active:scale-[0.97] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                        stu.status === 'Present'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleAttendance(stu.regNo, 'Absent')}
                      className={`px-2.5 py-1.5 min-h-[36px] rounded text-xs font-bold cursor-pointer active:scale-[0.97] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 ${
                        stu.status === 'Absent'
                          ? 'bg-rose-700 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleAttendance(stu.regNo, 'On-Duty')}
                      className={`px-2.5 py-1.5 min-h-[36px] rounded text-xs font-bold cursor-pointer active:scale-[0.97] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        stu.status === 'On-Duty'
                          ? 'bg-blue-700 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      OD
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setIsAttendanceModalOpen(false)}
                className="px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveAttendance();
                  setIsAttendanceModalOpen(false);
                }}
                className="px-4 py-2 min-h-[44px] rounded-xl bg-[#183668] hover:bg-[#12284C] text-white text-xs font-bold cursor-pointer active:scale-[0.98] transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
              >
                Confirm & Lock Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
