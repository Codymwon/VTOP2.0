import React, { useState } from 'react';
import { PageBreadcrumbHeader } from '../PageBreadcrumbHeader';
import { MOCK_FACULTY_COURSES } from '../../../../services/mockFacultyService';
import { FacultyCourse } from '../../../../types/faculty';
import {
  Users,
  MapPin,
  Clock,
  Search,
} from 'lucide-react';

interface FacultyCoursesPageViewProps {
  onBackToDashboard: () => void;
}

export const FacultyCoursesPageView: React.FC<FacultyCoursesPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<FacultyCourse>(MOCK_FACULTY_COURSES[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = selectedCourse.students.filter(
    (stu) =>
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.regNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageBreadcrumbHeader
        category="Instruction & Slots"
        title="My Courses & Assigned Slots"
        subtitle="Current Semester Allocations, Syllabus Completion Trackers, and Enrolled Class Rosters"
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
      />

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_FACULTY_COURSES.map((course) => {
          const isSelected = selectedCourse.id === course.id;
          return (
            <button
              key={course.id}
              type="button"
              onClick={() => setSelectedCourse(course)}
              className={`p-4 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                isSelected
                  ? 'bg-white border-[#176CB8] shadow-md ring-1 ring-[#176CB8]/20'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#176CB8] border border-blue-200/60">
                  {course.code}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {course.credits} Credits
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">
                {course.title}
              </h3>

              <div className="mt-2 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  <span>Slot: <strong>{course.slot}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  <span>Venue: <strong>{course.venue}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  <span>{course.enrolledCount} Enrolled Students</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[11px] font-semibold text-slate-600">Syllabus Completion</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">{course.syllabusProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${course.syllabusProgress}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Course Deep Dive Details */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900">
                {selectedCourse.code} — {selectedCourse.title}
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {selectedCourse.type}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Slot: <strong>{selectedCourse.slot}</strong> • Venue: <strong>{selectedCourse.venue}</strong> • Avg Attendance: <strong className="tabular-nums">{selectedCourse.averageAttendance}%</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs">
              <span className="text-[10px] uppercase font-bold text-teal-800 block">Next Lecture Focus</span>
              <span className="font-semibold">{selectedCourse.nextLectureTopic}</span>
            </div>
          </div>
        </div>

        {/* Student Roster Section */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Class Enrollment Roster ({selectedCourse.enrolledCount} Students)
              </h3>
              <p className="text-xs text-slate-500">
                Continuous Assessment Test 1 Scores & Class Attendance Tracking
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or reg no..."
                className="w-full pl-9 pr-3 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-2.5 px-3">Registration No</th>
                  <th scope="col" className="py-2.5 px-3">Student Name</th>
                  <th scope="col" className="py-2.5 px-3">Degree Program</th>
                  <th scope="col" className="py-2.5 px-3 text-center">Attendance Rate</th>
                  <th scope="col" className="py-2.5 px-3 text-right">CAT-1 Score (50)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((stu) => (
                  <tr key={stu.regNo} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {stu.regNo}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {stu.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {stu.program}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-bold ${
                          stu.attendanceRate < 75
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {stu.attendanceRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {stu.cat1Score ? `${stu.cat1Score} / 50` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
