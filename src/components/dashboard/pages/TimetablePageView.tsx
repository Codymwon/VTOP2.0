import React, { useState } from 'react';
import { PageBreadcrumbHeader } from './PageBreadcrumbHeader';
import {
  Calendar,
  MapPin,
  LayoutGrid,
  List,
} from 'lucide-react';

interface TimetablePageViewProps {
  onBackToDashboard: () => void;
}

interface CourseItem {
  code: string;
  title: string;
  type: string;
  credits: number;
  slot: string;
  venue: string;
  faculty: string;
  school: string;
  color: string;
}

const REGISTERED_COURSES: CourseItem[] = [
  {
    code: 'CSE4012',
    title: 'UI UX User Experience Design',
    type: 'Embedded Theory',
    credits: 3.0,
    slot: 'C2+TC2',
    venue: 'AB1-513',
    faculty: 'Dr. Hussain Syed',
    school: 'SCOPE',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    code: 'CSE4012',
    title: 'UI UX User Experience Design (Lab)',
    type: 'Embedded Lab',
    credits: 1.0,
    slot: 'L23+L24',
    venue: 'AB1-101',
    faculty: 'Dr. Hussain Syed',
    school: 'SCOPE',
    color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  },
  {
    code: 'LIB2016',
    title: 'Human Factors Psychology',
    type: 'Theory Only',
    credits: 3.0,
    slot: 'A2+TA2',
    venue: 'AB1-218',
    faculty: 'Krishna Priya B',
    school: 'VISH',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  {
    code: 'PHY2005',
    title: 'Introduction to Nanotechnology',
    type: 'Theory Only',
    credits: 3.0,
    slot: 'B2+TB2',
    venue: 'AB1-225',
    faculty: 'K Uma Mahendra Kumar',
    school: 'SAS',
    color: 'bg-teal-100 text-teal-800 border-teal-300',
  },
  {
    code: 'STS3007',
    title: 'Advanced Competitive Coding - 1',
    type: 'Theory Only',
    credits: 3.0,
    slot: 'E2+TE2',
    venue: 'AB1-502C',
    faculty: 'Ishu Kumar',
    school: 'VISH',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    code: 'SWE4007',
    title: 'Software Application Architecture',
    type: 'Embedded Theory',
    credits: 3.0,
    slot: 'D2+TD2',
    venue: 'AB1-433',
    faculty: 'Tauseef Khan',
    school: 'SCOPE',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  {
    code: 'SWE4007',
    title: 'Software Application Architecture (Project)',
    type: 'Embedded Project',
    credits: 1.0,
    slot: 'PJ',
    venue: 'SCOPE LAB',
    faculty: 'Tauseef Khan',
    school: 'SCOPE',
    color: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  {
    code: 'SWE4008',
    title: 'Application Development & Deployment Architecture',
    type: 'Embedded Theory',
    credits: 3.0,
    slot: 'F2+TF2',
    venue: 'AB1-432',
    faculty: 'Sibi Chakkaravarthy S',
    school: 'SCOPE',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    code: 'SWE4008',
    title: 'Application Development & Deployment Architecture (Lab)',
    type: 'Embedded Lab',
    credits: 1.0,
    slot: 'L3+L4',
    venue: 'AB1-321',
    faculty: 'Sibi Chakkaravarthy S',
    school: 'SCOPE',
    color: 'bg-emerald-50 text-emerald-900 border-emerald-400',
  },
];

// Weekly Timetable Matrix Slots (Monday to Friday, 8am to 7pm)
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Timetable Matrix Rows: 10 hourly slots
const TIME_BLOCKS = [
  { time: '08:00 - 08:50', slotLabel: 'Slot 1' },
  { time: '09:00 - 09:50', slotLabel: 'Slot 2' },
  { time: '10:00 - 10:50', slotLabel: 'Slot 3' },
  { time: '11:00 - 11:50', slotLabel: 'Slot 4' },
  { time: '12:00 - 12:50', slotLabel: 'Slot 5' },
  { time: '13:00 - 14:00', slotLabel: 'LUNCH', isLunch: true },
  { time: '14:00 - 14:50', slotLabel: 'Slot 6' },
  { time: '15:00 - 15:50', slotLabel: 'Slot 7' },
  { time: '16:00 - 16:50', slotLabel: 'Slot 8' },
  { time: '17:00 - 17:50', slotLabel: 'Slot 9' },
  { time: '18:00 - 18:50', slotLabel: 'Slot 10' },
];

// Schedule map by Day and Time index
const SCHEDULE_GRID: Record<string, Record<number, { code: string; slot: string; venue: string; color: string } | null>> = {
  Monday: {
    1: { code: 'STS3007', slot: 'E2', venue: 'AB1-502C', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    2: { code: 'LIB2016', slot: 'A2', venue: 'AB1-218', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    3: { code: 'PHY2005', slot: 'B2', venue: 'AB1-225', color: 'bg-teal-100 text-teal-900 border-teal-300' },
    6: { code: 'SWE4007', slot: 'D2', venue: 'AB1-433', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
    7: { code: 'SWE4008', slot: 'F2', venue: 'AB1-432', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  },
  Tuesday: {
    1: { code: 'STS3007', slot: 'E2', venue: 'AB1-502C', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    2: { code: 'LIB2016', slot: 'A2', venue: 'AB1-218', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    6: { code: 'SWE4008', slot: 'L3+L4', venue: 'AB1-321', color: 'bg-emerald-50 text-emerald-900 border-emerald-400' },
    7: { code: 'SWE4008', slot: 'L3+L4', venue: 'AB1-321', color: 'bg-emerald-50 text-emerald-900 border-emerald-400' },
    9: { code: 'CSE4012', slot: 'TC2', venue: 'AB1-513', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  },
  Wednesday: {
    1: { code: 'STS3007', slot: 'TE2', venue: 'AB1-502C', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    3: { code: 'PHY2005', slot: 'B2', venue: 'AB1-225', color: 'bg-teal-100 text-teal-900 border-teal-300' },
    6: { code: 'SWE4007', slot: 'TD2', venue: 'AB1-433', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
    7: { code: 'SWE4008', slot: 'TF2', venue: 'AB1-432', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  },
  Thursday: {
    2: { code: 'LIB2016', slot: 'TA2', venue: 'AB1-218', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    3: { code: 'PHY2005', slot: 'TB2', venue: 'AB1-225', color: 'bg-teal-100 text-teal-900 border-teal-300' },
    7: { code: 'CSE4012', slot: 'C2', venue: 'AB1-513', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    8: { code: 'SWE4007', slot: 'D2', venue: 'AB1-433', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  },
  Friday: {
    1: { code: 'STS3007', slot: 'E2', venue: 'AB1-502C', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    6: { code: 'CSE4012', slot: 'C2', venue: 'AB1-513', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    8: { code: 'CSE4012', slot: 'L23+L24', venue: 'AB1-101', color: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
    9: { code: 'CSE4012', slot: 'L23+L24', venue: 'AB1-101', color: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
  },
};

export const TimetablePageView: React.FC<TimetablePageViewProps> = ({
  onBackToDashboard,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [highlightCourse, setHighlightCourse] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const totalCredits = REGISTERED_COURSES.reduce((acc, c) => acc + c.credits, 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Breadcrumb Header */}
      <PageBreadcrumbHeader
        category="Academics"
        title="Class Time Table"
        subtitle="Fall Semester 2026-27 · Registered 21.0 Credits (SCOPE)"
        onBackToDashboard={onBackToDashboard}
        onPrint={handlePrint}
        extraActions={
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] text-xs font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Weekly Matrix</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] text-xs font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Allocations List</span>
            </button>
          </div>
        }
      />

      {/* Credit Summary & Timing Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#176CB8]">
            <Calendar className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Weekly Academic Schedule</h2>
              <span className="text-[10px] font-bold bg-blue-100 text-[#176CB8] px-2 py-0.5 rounded-full">
                Theory + Lab Matrix
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Morning Theory (08:00 - 13:00) · Lunch Break (13:00 - 14:00) · Afternoon Theory (14:00 - 19:00)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-slate-500 block text-[11px] font-medium">Total Credits</span>
            <strong className="text-lg font-mono font-black text-slate-900 tabular-nums">
              {totalCredits.toFixed(1)}
            </strong>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-right">
            <span className="text-slate-500 block text-[11px] font-medium">Registered Courses</span>
            <strong className="text-lg font-mono font-black text-slate-900 tabular-nums">
              {REGISTERED_COURSES.length}
            </strong>
          </div>
        </div>
      </div>

      {/* Course Quick Legend Chips */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Registered Course Legend (Click to highlight in grid):
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setHighlightCourse(null)}
            className={`text-xs px-3 py-1.5 min-h-[36px] rounded-lg border font-medium transition-colors cursor-pointer ${
              highlightCourse === null
                ? 'bg-slate-900 text-white border-slate-900 font-bold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Show All
          </button>
          {Array.from(new Set(REGISTERED_COURSES.map((c) => c.code))).map((code) => {
            const course = REGISTERED_COURSES.find((c) => c.code === code);
            const isSelected = highlightCourse === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setHighlightCourse(isSelected ? null : code)}
                className={`text-xs px-3 py-1.5 min-h-[36px] rounded-lg border font-mono font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#176CB8] font-bold shadow-xs'
                    : 'opacity-90 hover:opacity-100'
                } ${course?.color || 'bg-slate-100 text-slate-800'}`}
              >
                {code} · {course?.slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: WEEKLY GRID MATRIX */}
      {viewMode === 'grid' && (
        <div className="space-y-3">
          {/* Mobile Day Selector (Visible on small screens) */}
          <div className="flex sm:hidden overflow-x-auto gap-1.5 pb-1" role="tablist" aria-label="Select Day">
            {WEEKDAYS.map((day) => (
              <button
                key={day}
                type="button"
                role="tab"
                aria-selected={selectedDay === day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-2.5 min-h-[44px] text-xs font-bold rounded-xl whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
                  selectedDay === day
                    ? 'bg-[#176CB8] text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Desktop Matrix Grid */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs" aria-label="Weekly Academic Timetable Matrix">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th scope="col" className="py-3 px-3 w-28 text-left border-r border-slate-200 uppercase tracking-wider text-[11px]">
                      Day / Time
                    </th>
                    {TIME_BLOCKS.map((tb, idx) => (
                      <th
                        scope="col"
                        key={idx}
                        className={`py-3 px-2 min-w-[105px] border-r border-slate-200 ${
                          tb.isLunch ? 'bg-amber-50/60 font-bold text-amber-800' : ''
                        }`}
                      >
                        <div className="font-mono text-[11px] font-bold text-slate-900">
                          {tb.time}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {tb.slotLabel}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {WEEKDAYS.map((day) => (
                    <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                      <th scope="row" className="py-3 px-3 text-left font-bold text-slate-900 border-r border-slate-200 bg-slate-50/50">
                        {day}
                      </th>

                      {TIME_BLOCKS.map((tb, idx) => {
                        if (tb.isLunch) {
                          return (
                            <td
                              key={idx}
                              className="py-3 px-2 border-r border-slate-200 bg-amber-50/40 text-amber-700/80 text-[10px] font-mono tracking-widest font-semibold"
                            >
                              LUNCH
                            </td>
                          );
                        }

                        const cellData = SCHEDULE_GRID[day]?.[idx];
                        const isHighlighted = highlightCourse ? cellData?.code === highlightCourse : false;
                        const isDimmed = highlightCourse && cellData && cellData.code !== highlightCourse;

                        return (
                          <td
                            key={idx}
                            className={`py-2 px-1.5 border-r border-slate-200 align-middle ${
                              cellData ? '' : 'bg-slate-50/20'
                            }`}
                          >
                            {cellData ? (
                              <div
                                className={`p-1.5 rounded-lg border text-center transition-all ${
                                  cellData.color
                                } ${isHighlighted ? 'ring-2 ring-[#176CB8] scale-105 shadow-md' : ''} ${
                                  isDimmed ? 'opacity-30' : ''
                                }`}
                              >
                                <div className="font-mono font-bold text-xs tracking-tight">
                                  {cellData.code}
                                </div>
                                <div className="text-[10px] font-semibold opacity-90">
                                  {cellData.slot}
                                </div>
                                <div className="text-[10px] font-mono text-slate-600 flex items-center justify-center gap-0.5 mt-0.5">
                                  <MapPin className="w-2.5 h-2.5 opacity-60" aria-hidden="true" />
                                  <span>{cellData.venue}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-mono text-[10px]">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COURSE ALLOCATION DETAILS TABLE */}
      {viewMode === 'list' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" aria-label="Course Allocations Details Table">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                  <th scope="col" className="py-3 px-4 min-w-[120px]">Course Code</th>
                  <th scope="col" className="py-3 px-4 min-w-[220px]">Course Title</th>
                  <th scope="col" className="py-3 px-4 min-w-[130px]">Course Type</th>
                  <th scope="col" className="py-3 px-4 text-center min-w-[80px]">Credits</th>
                  <th scope="col" className="py-3 px-4 min-w-[100px]">Slot</th>
                  <th scope="col" className="py-3 px-4 min-w-[110px]">Venue</th>
                  <th scope="col" className="py-3 px-4 min-w-[180px]">Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {REGISTERED_COURSES.map((course, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-500 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {course.code}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {course.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {course.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                      {course.credits.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#176CB8]">
                      {course.slot}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" aria-hidden="true" />
                        <span>{course.venue}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{course.faculty}</div>
                      <div className="text-[10px] text-slate-500">{course.school}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
