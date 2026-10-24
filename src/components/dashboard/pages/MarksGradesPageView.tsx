import React, { useState, useEffect } from 'react';
import { PageBreadcrumbHeader } from './PageBreadcrumbHeader';
import {
  MOCK_ASSESSMENT_MARKS,
  MOCK_WINTER_GRADES,
  MOCK_GRADE_HISTORY,
  MOCK_ACADEMIC_KPIS,
  MOCK_EXAM_SCHEDULE,
} from '../../../services/mockDashboardService';
import {
  Award,
  Search,
  CheckCircle2,
  BarChart3,
  Calendar,
  Download,
  Clock,
  MapPin,
  FileText,
} from 'lucide-react';

interface MarksGradesPageViewProps {
  initialTab?: 'schedule' | 'marks' | 'grades' | 'gradehistory';
  onBackToDashboard: () => void;
}

export const MarksGradesPageView: React.FC<MarksGradesPageViewProps> = ({
  initialTab = 'schedule',
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'marks' | 'grades' | 'gradehistory'>(initialTab);
  const [marksFilterCourse, setMarksFilterCourse] = useState<string>('all');
  const [historySearch, setHistorySearch] = useState<string>('');
  const [examTypeFilter, setExamTypeFilter] = useState<string>('all');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Exam Schedule Filtering
  const filteredSchedule = MOCK_EXAM_SCHEDULE.filter(
    (e) => examTypeFilter === 'all' || e.examType === examTypeFilter
  );

  // Marks Filtering
  const coursesWithMarks = Array.from(new Set(MOCK_ASSESSMENT_MARKS.map((m) => m.courseCode)));
  const filteredMarks = MOCK_ASSESSMENT_MARKS.filter(
    (m) => marksFilterCourse === 'all' || m.courseCode === marksFilterCourse
  );

  // Grade History Filtering
  const filteredHistory = MOCK_GRADE_HISTORY.filter(
    (g) =>
      g.courseCode.toLowerCase().includes(historySearch.toLowerCase()) ||
      g.courseTitle.toLowerCase().includes(historySearch.toLowerCase())
  );

  // Grade Point Helper (Explicit separation of Points & Letter Grades)
  const getGradePoint = (grade: string): number => {
    switch (grade) {
      case 'S':
        return 10;
      case 'A':
        return 9;
      case 'B':
        return 8;
      case 'C':
        return 7;
      case 'D':
        return 6;
      case 'E':
        return 5;
      default:
        return 0;
    }
  };

  // Grade Color Mapping
  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'S':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-black';
      case 'A':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      case 'B':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-semibold';
      case 'C':
        return 'bg-slate-100 text-slate-800 border-slate-300 font-medium';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <PageBreadcrumbHeader
        category="Examinations"
        title="Examinations, Schedule, Marks & Grade Records"
        subtitle="Mid-term exam schedules, CAT marks, weightages, letter grades, grade points, and cumulative CGPA history."
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Downloading official Verified Examination Hall Ticket for Fall 2026-27 (PDF)...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Hall Ticket</span>
            </button>
            <span className="text-xs font-mono font-bold bg-blue-50 text-[#176CB8] border border-blue-200 px-3 py-1.5 rounded-xl">
              CGPA: {MOCK_ACADEMIC_KPIS.cgpa} · 134.0 Credits
            </span>
          </div>
        }
      />

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cumulative CGPA</div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
              {MOCK_ACADEMIC_KPIS.cgpa}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              First Class
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Out of 10.0 scale</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Earned Credits</div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
              {MOCK_ACADEMIC_KPIS.totalEarnedCredits}
            </span>
            <span className="text-xs text-slate-500 font-medium">Credits</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Completed towards degree</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming CAT Exams</div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#176CB8] font-mono tabular-nums">
              {MOCK_EXAM_SCHEDULE.length}
            </span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              Hall Ticket Active
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Starts 18-Sep-2026</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Standing Backlogs</div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tabular-nums">
              0
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Clean Record
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Zero arrears on transcript</div>
        </div>
      </div>

      {/* Tabs Navigation Bar (3 Distinct Sub-Tabs) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 flex flex-wrap gap-1 shadow-xs" role="tablist" aria-label="Examination Sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'schedule'}
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 min-w-[170px] py-3 px-4 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-[#176CB8] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" aria-hidden="true" />
          <span>Exam Schedule & Hall Ticket</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'marks'}
          onClick={() => setActiveTab('marks')}
          className={`flex-1 min-w-[170px] py-3 px-4 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
            activeTab === 'marks'
              ? 'bg-[#176CB8] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" aria-hidden="true" />
          <span>Continuous Assessment Marks (CAM)</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'grades' || activeTab === 'gradehistory'}
          onClick={() => setActiveTab('grades')}
          className={`flex-1 min-w-[170px] py-3 px-4 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
            activeTab === 'grades' || activeTab === 'gradehistory'
              ? 'bg-[#176CB8] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" aria-hidden="true" />
          <span>Semester Grades & Cumulative CGPA</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EXAM SCHEDULE & HALL TICKET                                        */}
      {/* ========================================================================= */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {/* Hall Ticket Advisory Banner */}
          <div className="bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#176CB8] text-white flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Fall Semester 2026-27 Continuous Assessment Test 1 (CAT-1)
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Fee Cleared
                  </span>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Hall Ticket generated for <strong>ARJUN K SHARMA (23BCE1088)</strong>. Students must present their physical or digital biometric ID card at the examination hall <strong>30 minutes</strong> prior to commencement.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => alert('Downloading official Verified CAT-1 Hall Ticket with Biometric QR...')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Hall Ticket</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 mr-1">Exam Type:</span>
              {['all', 'CAT-1', 'CAT-2', 'FAT (Final Assessment Test)'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setExamTypeFilter(type)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    examTypeFilter === type
                      ? 'bg-[#176CB8] text-white shadow-2xs font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'all' ? 'All Sessions' : type}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-500">
              Showing <strong>{filteredSchedule.length}</strong> scheduled papers
            </div>
          </div>

          {/* Schedule Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                    <th scope="col" className="py-3 px-4 min-w-[110px]">Course Code</th>
                    <th scope="col" className="py-3 px-4 min-w-[200px]">Course Title</th>
                    <th scope="col" className="py-3 px-4 min-w-[90px]">Exam Type</th>
                    <th scope="col" className="py-3 px-4 min-w-[110px]">Date</th>
                    <th scope="col" className="py-3 px-4 min-w-[90px]">Day</th>
                    <th scope="col" className="py-3 px-4 min-w-[140px]">Session & Timing</th>
                    <th scope="col" className="py-3 px-4 min-w-[130px]">Hall / Venue</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[100px]">Seat Allocation</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[90px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchedule.map((item, idx) => {
                    const parsedDate = new Date(item.examDate);
                    const dayName = isNaN(parsedDate.getTime())
                      ? 'Weekday'
                      : parsedDate.toLocaleDateString('en-US', { weekday: 'short' });

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center font-mono text-slate-500 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {item.courseCode}
                          </span>
                          <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                            Slot: {item.slot}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{item.courseTitle}</div>
                          <div className="text-[10px] text-slate-500">{item.courseType}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {item.examType}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {item.examDate}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {dayName}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">
                            {item.session} ({item.examTime})
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Report by {item.reportingTime}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 font-semibold text-slate-800">
                            <MapPin className="w-3.5 h-3.5 text-[#176CB8]" />
                            <span>{item.venue}</span>
                          </div>
                        </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-black text-[#176CB8] bg-blue-50 px-2.5 py-1 rounded border border-blue-200 text-xs">
                          {item.seatNo}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          <Calendar className="w-2.5 h-2.5" />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CONTINUOUS ASSESSMENT MARKS (PURE MARKS COLUMNS)                  */}
      {/* ========================================================================= */}
      {activeTab === 'marks' && (
        <div className="space-y-4">
          {/* Course Filter Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500">Filter Course:</span>
              <button
                type="button"
                onClick={() => setMarksFilterCourse('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  marksFilterCourse === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Courses ({MOCK_ASSESSMENT_MARKS.length})
              </button>
              {coursesWithMarks.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setMarksFilterCourse(code)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer ${
                    marksFilterCourse === code
                      ? 'bg-[#176CB8] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500">
              Showing <strong>{filteredMarks.length}</strong> evaluation records
            </div>
          </div>

          {/* Assessment Table with Isolated Marks Columns */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" aria-label="Continuous Assessment Marks Table">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                    <th scope="col" className="py-3 px-4 min-w-[110px]">Course Code</th>
                    <th scope="col" className="py-3 px-4 min-w-[200px]">Course Title & Faculty</th>
                    <th scope="col" className="py-3 px-4 min-w-[200px]">Assessment Component Title</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[90px]">Max Marks</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[90px]">Weightage %</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[80px]">Status</th>
                    <th scope="col" className="py-3 px-4 text-right min-w-[100px]">Scored Mark</th>
                    <th scope="col" className="py-3 px-4 text-right min-w-[110px]">Weightage Mark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMarks.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-slate-500 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {m.courseCode}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-mono font-medium mt-0.5">
                          {m.slot}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{m.courseTitle}</div>
                        <div className="text-[11px] text-slate-500">{m.facultyName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{m.title}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                          {m.courseType}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-700">
                        {m.maxMarks}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                        {m.weightage}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                        {m.scoredMark.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-black text-[#176CB8] text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {m.weightageMark.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SEMESTER GRADES & CUMULATIVE CGPA (ISOLATED GRADE/POINT COLUMNS)   */}
      {/* ========================================================================= */}
      {(activeTab === 'grades' || activeTab === 'gradehistory') && (
        <div className="space-y-4">
          {/* Sub-view toggle between Semester Grades and Cumulative History */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('grades')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'grades'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Winter 2025-26 Grades Sheet
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gradehistory')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'gradehistory'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cumulative Transcript History (134 Credits)
              </button>
            </div>

            <div className="text-xs font-mono font-semibold text-slate-600">
              Grade Point Scale: S=10 • A=9 • B=8 • C=7 • D=6 • E=5
            </div>
          </div>

          {activeTab === 'grades' && (
            <>
              {/* Semester SGPA Banner */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Official Exam Session</span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    Winter Semester 2025-26 Academic Performance
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Exam Session: May 2026 • Official Controller of Examinations Notification
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 sm:px-5">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Semester SGPA</span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-mono">
                      8.42
                    </div>
                  </div>
                  <div className="h-8 w-px bg-emerald-200" />
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Credits Cleared</span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-mono">
                      17.0
                    </div>
                  </div>
                </div>
              </div>

              {/* Winter Grades Table with EXPLICIT SEPARATED COLUMNS */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                        <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                        <th scope="col" className="py-3 px-4 min-w-[120px]">Course Code</th>
                        <th scope="col" className="py-3 px-4 min-w-[240px]">Course Title</th>
                        <th scope="col" className="py-3 px-4 min-w-[90px]">Course Type</th>
                        <th scope="col" className="py-3 px-4 text-center min-w-[80px]">Credits</th>
                        <th scope="col" className="py-3 px-4 text-center min-w-[110px] bg-blue-50/50">
                          Grade Point (10)
                        </th>
                        <th scope="col" className="py-3 px-4 text-center min-w-[100px] bg-amber-50/50">
                          Letter Grade
                        </th>
                        <th scope="col" className="py-3 px-4 text-right min-w-[110px]">Result Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_WINTER_GRADES.map((g, idx) => (
                        <tr key={g.courseCode} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 text-center font-mono text-slate-500 font-medium">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {g.courseCode}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {g.courseTitle}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {g.courseType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                            {g.credits.toFixed(1)}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-black text-slate-900 text-sm bg-blue-50/30">
                            {getGradePoint(g.grade)}.0
                          </td>
                          <td className="py-3 px-4 text-center bg-amber-50/30">
                            <span className={`inline-block px-3 py-1 rounded-lg text-xs border font-mono ${getGradeBadge(g.grade)}`}>
                              {g.grade}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-700">
                            Pass
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Summary Box matching Prototype Page 15 */}
              <div className="flex justify-end">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-3 px-5 shadow-xs flex items-center gap-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Semester GPA</span>
                    <strong className="text-xl font-black font-mono text-emerald-700">8.42</strong>
                  </div>
                  <div className="h-7 w-px bg-slate-200" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Credits Cleared</span>
                    <strong className="text-xl font-black font-mono text-slate-900">17.0</strong>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'gradehistory' && (
            <>
              {/* Grade Distribution Bar */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Cumulative Grade Points Breakdown across 134.0 Credits:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <span className="block text-xl font-black font-mono text-amber-800">2</span>
                    <span className="text-xs font-bold text-amber-700">Grade 'S' (10 pts)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="block text-xl font-black font-mono text-emerald-800">14</span>
                    <span className="text-xs font-bold text-emerald-700">Grade 'A' (9 pts)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                    <span className="block text-xl font-black font-mono text-blue-800">19</span>
                    <span className="text-xs font-bold text-blue-700">Grade 'B' (8 pts)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-center">
                    <span className="block text-xl font-black font-mono text-slate-800">2</span>
                    <span className="text-xs font-bold text-slate-700">Grade 'C' (7 pts)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-center col-span-2 sm:col-span-1">
                    <span className="block text-xl font-black font-mono text-teal-800">0</span>
                    <span className="text-xs font-bold text-teal-700">Backlogs (F/N)</span>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    aria-label="Search transcript course code or title"
                    placeholder="Search transcript course code or title..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full min-h-[44px] pl-9.5 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:bg-white text-slate-900 transition-all placeholder:text-slate-500"
                  />
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Showing <strong>{filteredHistory.length}</strong> accredited courses
                </div>
              </div>

              {/* Full Cumulative History Table with EXPLICIT SEPARATED COLUMNS */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                        <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                        <th scope="col" className="py-3 px-4 min-w-[120px]">Course Code</th>
                        <th scope="col" className="py-3 px-4 min-w-[260px]">Course Title</th>
                        <th scope="col" className="py-3 px-4 min-w-[90px]">Type</th>
                        <th scope="col" className="py-3 px-4 text-center min-w-[80px]">Credits</th>
                        <th scope="col" className="py-3 px-4 text-center min-w-[110px] bg-blue-50/50">
                          Grade Point
                        </th>
                        <th scope="col" className="py-3 px-4 text-center min-w-[90px] bg-amber-50/50">
                          Letter Grade
                        </th>
                        <th scope="col" className="py-3 px-4 text-right min-w-[120px]">Exam Session</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredHistory.map((h, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 text-center font-mono text-slate-500 font-medium">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {h.courseCode}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {h.courseTitle}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {h.courseType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                            {h.credits.toFixed(1)}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-black text-slate-900 text-sm bg-blue-50/30">
                            {getGradePoint(h.grade)}.0
                          </td>
                          <td className="py-3 px-4 text-center bg-amber-50/30">
                            <span className={`inline-block px-3 py-1 rounded-lg text-xs border font-mono ${getGradeBadge(h.grade)}`}>
                              {h.grade}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-600">
                            {h.examMonth}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls matching Prototype Page 16 */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Page 1 of 2 (Showing 15 of 34 accredited courses)</span>
                  <div className="flex items-center gap-1 font-mono">
                    <button
                      type="button"
                      disabled
                      className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-400 cursor-not-allowed opacity-60"
                    >
                      &lt;
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded border border-[#176CB8] bg-[#176CB8] text-white font-bold"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      2
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      &gt;
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      &gt;&gt;
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
