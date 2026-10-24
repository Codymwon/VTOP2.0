import React, { useState } from 'react';
import { PageBreadcrumbHeader } from './PageBreadcrumbHeader';
import { EnrolledCourseItem } from '../../../types/courses';
import { MOCK_ENROLLED_COURSES } from '../../../services/mockCourseService';
import {
  Search,
  Download,
  FileText,
  User,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

interface CoursesPageViewProps {
  onBackToDashboard: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const CoursesPageView: React.FC<CoursesPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [courses] = useState<EnrolledCourseItem[]>(MOCK_ENROLLED_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('Fall Semester 2026-27');
  const [activeCourseCode, setActiveCourseCode] = useState<string | null>(null);

  const filteredCourses = courses.filter(
    (c) =>
      c.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slot.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCredits = courses.reduce((acc, c) => acc + c.credits.total, 0);

  const activeCourse = activeCourseCode
    ? courses.find((c) => c.courseCode === activeCourseCode)
    : null;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <PageBreadcrumbHeader
        category="Academics"
        title="My Courses & Study Materials"
        subtitle="Fall Semester 2026-27 registered courses, curriculum syllabi, and official faculty lecture materials repository."
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <span className="text-xs font-mono font-bold bg-blue-50 text-[#176CB8] border border-blue-200 px-3 py-1.5 rounded-xl">
            {courses.length} Registered Courses • {totalCredits.toFixed(1)} Credits
          </span>
        }
      />

      {/* ========================================================================= */}
      {/* VIEW 1: PROTOTYPE PAGE 8 - MY COURSES DIRECTORY                           */}
      {/* ========================================================================= */}
      {!activeCourse ? (
        <div className="space-y-4">
          {/* Top Controls Bar with Semester Dropdown & Search (Page 8) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Academic Session:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
              >
                <option value="Fall Semester 2026-27">Fall Semester 2026-27 (Current)</option>
                <option value="Winter Semester 2025-26">Winter Semester 2025-26</option>
              </select>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by course code, title, or professor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:bg-white text-slate-900 transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Courses Grid with "View Materials ->" Button (Page 8) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((c) => (
              <div
                key={c.courseCode}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#176CB8] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {c.courseCode}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Slot: {c.slot}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {c.courseTitle}
                    </h3>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.facultyName}</span>
                    </div>
                  </div>

                  {/* L-T-P-J Credits Pill */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-xs font-mono flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-sans">Credits</span>
                    <span className="font-bold text-slate-800">
                      L:{c.credits.lecture} T:{c.credits.tutorial} P:{c.credits.practical} J:{c.credits.project} ({c.credits.total.toFixed(1)} cr)
                    </span>
                  </div>
                </div>

                {/* Primary Button matching Page 8 */}
                <button
                  type="button"
                  onClick={() => setActiveCourseCode(c.courseCode)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] shadow-2xs transition-colors cursor-pointer"
                >
                  <span>View Materials</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: PROTOTYPE PAGE 9 - COURSE STUDY MATERIALS & SYLLABUS              */
        /* ========================================================================= */
        <div className="space-y-4 animate-in fade-in">
          {/* Header Strip with Back to Courses and Syllabus Download (Page 9) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveCourseCode(null)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[36px] text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Courses</span>
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#176CB8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {activeCourse.courseCode}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeCourse.courseTitle}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instructor: <strong>{activeCourse.facultyName}</strong> ({activeCourse.facultySchool}) • Venue: {activeCourse.venue}
                </p>
              </div>
            </div>

            {/* Syllabus Download Button (Page 9 Top Right) */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => alert(`Downloading official Syllabus document for ${activeCourse.courseCode} - ${activeCourse.courseTitle} (PDF)`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Syllabus (PDF)</span>
              </button>
            </div>
          </div>

          {/* Study Materials Table matching Prototype Page 9 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Uploaded Lecture Notes & Slide Decks
              </h4>
              <span className="text-xs font-mono font-semibold text-slate-500">
                {activeCourse.materials.length} Documents Available
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                    <th scope="col" className="py-3 px-4 min-w-[260px]">Title</th>
                    <th scope="col" className="py-3 px-4 min-w-[120px]">Uploaded Date</th>
                    <th scope="col" className="py-3 px-4 min-w-[100px]">File Size</th>
                    <th scope="col" className="py-3 px-4 text-right min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeCourse.materials.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <FileText className="w-4 h-4 text-[#176CB8] shrink-0" />
                          <span>{m.title}</span>
                        </div>
                        {m.facultyRemark && (
                          <p className="text-[11px] text-slate-500 italic mt-0.5 ml-6">
                            "{m.facultyRemark}"
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {m.uploadedDate}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {m.fileSize}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => alert(`Downloading verified document: ${m.title}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-bold text-[#176CB8] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Module-Wise Syllabus Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Official Curriculum & Module Structure
            </h4>
            <div className="space-y-3">
              {activeCourse.syllabus.map((mod) => (
                <div key={mod.moduleNo} className="border border-slate-200 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900">
                      Module {mod.moduleNo}: {mod.title}
                    </h5>
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      {mod.hours} Hours
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5 pl-1">
                    {mod.topics.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
