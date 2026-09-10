import React, { useState } from 'react';
import { PageBreadcrumbHeader } from './PageBreadcrumbHeader';
import {
  MOCK_ASSESSMENT_MARKS,
  MOCK_WINTER_GRADES,
  MOCK_GRADE_HISTORY,
  MOCK_ACADEMIC_KPIS,
} from '../../../services/mockDashboardService';
import {
  Award,
  Search,
  CheckCircle2,
  BarChart3,
  Layers,
} from 'lucide-react';

interface MarksGradesPageViewProps {
  initialTab?: 'marks' | 'grades' | 'gradehistory';
  onBackToDashboard: () => void;
}

export const MarksGradesPageView: React.FC<MarksGradesPageViewProps> = ({
  initialTab = 'marks',
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'marks' | 'grades' | 'gradehistory'>(initialTab);
  const [marksFilterCourse, setMarksFilterCourse] = useState<string>('all');
  const [historySearch, setHistorySearch] = useState<string>('');

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
        title="Examinations, Marks & Grade Records"
        subtitle="Continuous Assessment (CAT), component weightages, semester grades, and 134-credit cumulative CGPA history."
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <div className="flex items-center gap-2">
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
            <span className="text-xs text-slate-500">Credits</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Completed towards M.Tech. degree</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Arrears / Backlogs</div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tabular-nums">
              0
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Clean Record
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Zero standing backlogs</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Fall Sem</div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#176CB8] font-mono tabular-nums">
              {MOCK_ACADEMIC_KPIS.currentSemesterCredits}
            </span>
            <span className="text-xs text-slate-500">In Progress</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Fall 2026-27 credits registered</div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 flex flex-wrap gap-1 shadow-xs" role="tablist" aria-label="Examination Sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'marks'}
          onClick={() => setActiveTab('marks')}
          className={`flex-1 min-w-[180px] py-3 px-4 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
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
          aria-selected={activeTab === 'grades'}
          onClick={() => setActiveTab('grades')}
          className={`flex-1 min-w-[180px] py-3 px-4 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
            activeTab === 'grades'
              ? 'bg-[#176CB8] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" aria-hidden="true" />
          <span>Winter 2025-26 Grades</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'gradehistory'}
          onClick={() => setActiveTab('gradehistory')}
          className={`flex-1 min-w-[180px] py-3 px-4 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
            activeTab === 'gradehistory'
              ? 'bg-[#176CB8] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" aria-hidden="true" />
          <span>Cumulative Grade History (134 Credits)</span>
        </button>
      </div>

      {/* TAB 1: CONTINUOUS ASSESSMENT MARKS */}
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

          {/* Assessment Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" aria-label="Continuous Assessment Marks (CAM) Table">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                    <th scope="col" className="py-3 px-4 min-w-[110px]">Course Code</th>
                    <th scope="col" className="py-3 px-4 min-w-[200px]">Course Title</th>
                    <th scope="col" className="py-3 px-4 min-w-[200px]">Assessment Component Title</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[90px]">Max Marks</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[90px]">Weightage</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[80px]">Status</th>
                    <th scope="col" className="py-3 px-4 text-right min-w-[100px]">Scored Mark</th>
                    <th scope="col" className="py-3 px-4 text-right min-w-[110px]">Weight Mark</th>
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
                          <CheckCircle2 className="w-2.5 h-2.5" aria-hidden="true" />
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

      {/* TAB 2: SEMESTER GRADES */}
      {activeTab === 'grades' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Exam Session</span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                Winter Semester 2025-26 Results
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exam Held: May 2026 · Declaration: June 2026
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

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" aria-label="Winter Semester 2025-26 Grades Table">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                    <th scope="col" className="py-3 px-4 min-w-[120px]">Course Code</th>
                    <th scope="col" className="py-3 px-4 min-w-[240px]">Course Title</th>
                    <th scope="col" className="py-3 px-4 min-w-[100px]">Type</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[80px]">Credits</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[90px]">Marks Scored</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[90px]">Grade</th>
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
                    <td className="py-3 px-4 text-center font-mono text-slate-700">
                      {g.marksScored || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs border font-mono ${getGradeBadge(g.grade)}`}>
                        {g.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-700">
                      Pass
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

      {/* TAB 3: CUMULATIVE GRADE HISTORY & TRANSCRIPT */}
      {activeTab === 'gradehistory' && (
        <div className="space-y-4">
          {/* Grade Distribution Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Total Grade Points Distribution (134.0 Credits Completed):
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
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
              <input
                type="text"
                aria-label="Search transcript course code or title"
                placeholder="Search transcript course code or title..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full min-h-[44px] pl-9.5 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:bg-white text-slate-900 transition-all placeholder:text-slate-500"
              />
            </div>
            <div className="text-xs text-slate-500">
              Showing <strong>{filteredHistory.length}</strong> accredited courses
            </div>
          </div>

          {/* Full History Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" aria-label="Cumulative Grade History and Transcript Table">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                    <th scope="col" className="py-3 px-4 min-w-[120px]">Course Code</th>
                    <th scope="col" className="py-3 px-4 min-w-[260px]">Course Title</th>
                    <th scope="col" className="py-3 px-4 min-w-[90px]">Type</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[80px]">Credits</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[80px]">Grade</th>
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
                    <td className="py-3 px-4 text-center">
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
        </div>
      </div>
    )}
    </div>
  );
};
