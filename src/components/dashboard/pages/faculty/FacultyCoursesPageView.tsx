import React, { useState } from 'react';
import { PageBreadcrumbHeader } from '../PageBreadcrumbHeader';
import { MOCK_FACULTY_COURSES } from '../../../../services/mockFacultyService';
import { FacultyCourse } from '../../../../types/faculty';
import {
  Users,
  MapPin,
  Clock,
  Search,
  BookOpen,
  CheckCircle2,
  FileText,
  Upload,
  Send,
  Download,
  Sparkles,
} from 'lucide-react';

interface FacultyCoursesPageViewProps {
  onBackToDashboard: () => void;
}

interface SyllabusUnit {
  unitNo: number;
  title: string;
  hours: number;
  topics: { id: string; name: string; completed: boolean }[];
}

const DEFAULT_SYLLABUS: Record<string, SyllabusUnit[]> = {
  CSE4012: [
    {
      unitNo: 1,
      title: 'Foundations of HCI & Human Centered Design',
      hours: 8,
      topics: [
        { id: 't1', name: "Introduction to Human Capabilities, Memory & Fitts's Law", completed: true },
        { id: 't2', name: "Cognitive Walkthrough & Conceptual Models", completed: true },
        { id: 't3', name: "GOMS & Keystroke-Level Modeling (KLM)", completed: true },
      ],
    },
    {
      unitNo: 2,
      title: 'Design Principles & Nielsen Heuristics',
      hours: 9,
      topics: [
        { id: 't4', name: "10 Usability Heuristics by Jakob Nielsen", completed: true },
        { id: 't5', name: "Affordance, Signifiers, and Feedback Loops", completed: true },
        { id: 't6', name: "Error Prevention & Recovery Mechanisms", completed: true },
      ],
    },
    {
      unitNo: 3,
      title: 'Interaction Styles & Interface Architecture',
      hours: 10,
      topics: [
        { id: 't7', name: 'Direct Manipulation & Mental Models', completed: true },
        { id: 't8', name: 'Visual Hierarchy, Typography, and Density', completed: false },
        { id: 't9', name: 'Design Tokens & Enterprise UI Systems', completed: false },
      ],
    },
    {
      unitNo: 4,
      title: 'Prototyping & Usability Testing Methods',
      hours: 8,
      topics: [
        { id: 't10', name: 'Low vs High Fidelity Prototyping (Figma / Code)', completed: false },
        { id: 't11', name: 'Think-Aloud Protocol & Remote Unmoderated Testing', completed: false },
        { id: 't12', name: 'SUS & NASA-TLX Usability Metrics', completed: false },
      ],
    },
    {
      unitNo: 5,
      title: 'Accessibility (WCAG 2.2) & Emerging Technologies',
      hours: 7,
      topics: [
        { id: 't13', name: 'WCAG 2.2 AA Contrast, Screen Readers & Keyboard Trapping', completed: false },
        { id: 't14', name: 'Multimodal Interfaces & AI-Augmented Workflows', completed: false },
      ],
    },
  ],
};

export const FacultyCoursesPageView: React.FC<FacultyCoursesPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<FacultyCourse>(MOCK_FACULTY_COURSES[0]);
  const [activeTab, setActiveTab] = useState<'roster' | 'syllabus' | 'materials'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'critical' | 'safe'>('all');
  const [syllabusUnits, setSyllabusUnits] = useState(DEFAULT_SYLLABUS);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementSent, setAnnouncementSent] = useState(false);

  const handleUploadMaterial = () => {
    const title = prompt('Enter material title or chapter name (e.g., Module 3 Handout.pdf):');
    if (title && title.trim()) {
      setMaterials((prev) => [
        {
          id: `mat-${Date.now()}`,
          title: title.trim(),
          size: '2.4 MB',
          date: 'Just now',
          downloads: 0,
        },
        ...prev,
      ]);
    }
  };

  // Materials list
  const [materials, setMaterials] = useState([
    { id: 'mat-1', title: 'Lecture 01-04: Human Cognition & Fitts Law Slides.pdf', size: '4.8 MB', date: '12-Aug-2026', downloads: 61 },
    { id: 'mat-2', title: 'DA 1 Heuristic Evaluation Template & Rubrics.docx', size: '1.2 MB', date: '28-Aug-2026', downloads: 64 },
    { id: 'mat-3', title: 'Lecture 08-12: Visual Hierarchy & Design Systems.pdf', size: '6.5 MB', date: '15-Sep-2026', downloads: 58 },
  ]);

  const currentSyllabus = syllabusUnits[selectedCourse.code] || syllabusUnits['CSE4012'];

  // Toggle syllabus topic completion
  const handleToggleTopic = (topicId: string) => {
    setSyllabusUnits((prev) => {
      const copy = { ...prev };
      const units = copy[selectedCourse.code] || copy['CSE4012'];
      const updated = units.map((unit) => ({
        ...unit,
        topics: unit.topics.map((t) => (t.id === topicId ? { ...t, completed: !t.completed } : t)),
      }));
      copy[selectedCourse.code] = updated;
      return copy;
    });
  };

  // Calculate live syllabus completion percentage
  const totalTopics = currentSyllabus.reduce((acc, u) => acc + u.topics.length, 0);
  const completedTopics = currentSyllabus.reduce(
    (acc, u) => acc + u.topics.filter((t) => t.completed).length,
    0
  );
  const completionPercentage = Math.round((completedTopics / (totalTopics || 1)) * 100);

  // Filter students
  const filteredStudents = selectedCourse.students.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.regNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (attendanceFilter === 'critical') return stu.attendanceRate < 75;
    if (attendanceFilter === 'safe') return stu.attendanceRate >= 75;
    return true;
  });

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setAnnouncementSent(true);
    setAnnouncementText('');
    setTimeout(() => setAnnouncementSent(false), 4000);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageBreadcrumbHeader
        category="Faculty Instruction Desk"
        title="My Courses & Assigned Slots"
        subtitle="Active Teaching Allotments, Syllabus Completion Progress, and Class Enrolment Roster"
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
      />

      {/* Courses Cards Grid */}
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
                  ? 'bg-white border-[#176CB8] shadow-md ring-2 ring-[#176CB8]/20'
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
                  <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>Slot: <strong>{course.slot}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>Venue: <strong>{course.venue}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span><strong>{course.enrolledCount}</strong> Students Enrolled</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[11px] font-semibold text-slate-600">Syllabus Progress</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">{completionPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Course Detail Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Course Header Banner */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono font-bold text-xs border border-blue-400/30">
                {selectedCourse.code}
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                {selectedCourse.title}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/15">
                {selectedCourse.type}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 flex flex-wrap items-center gap-3">
              <span>Slot: <strong className="text-white">{selectedCourse.slot}</strong></span>
              <span>•</span>
              <span>Room: <strong className="text-white">{selectedCourse.venue}</strong></span>
              <span>•</span>
              <span>Class Avg Attendance: <strong className="text-emerald-400 font-mono">{selectedCourse.averageAttendance}%</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-right">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Syllabus Coverage</span>
              <span className="text-lg font-black font-mono text-emerald-400">{completionPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 border-b border-slate-200/80 bg-slate-50/80 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-white text-[#176CB8] shadow-xs font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Class Enrolment Roster ({selectedCourse.enrolledCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('syllabus')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'syllabus'
                ? 'bg-white text-[#176CB8] shadow-xs font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Syllabus & Lesson Plan ({completionPercentage}%)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('materials')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'materials'
                ? 'bg-white text-[#176CB8] shadow-xs font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Course Material & Announcements</span>
          </button>
        </div>

        {/* TAB 1: CLASS ROSTER */}
        {activeTab === 'roster' && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Filter Attendance:</span>
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setAttendanceFilter('all')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      attendanceFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    All ({selectedCourse.students.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendanceFilter('critical')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      attendanceFilter === 'critical' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    &lt; 75% Debar Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendanceFilter('safe')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      attendanceFilter === 'safe' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    ≥ 75% Safe
                  </button>
                </div>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student name or reg no..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th scope="col" className="py-2.5 px-3">Reg No</th>
                    <th scope="col" className="py-2.5 px-3">Student Name</th>
                    <th scope="col" className="py-2.5 px-3">Program</th>
                    <th scope="col" className="py-2.5 px-3 text-center">Attendance</th>
                    <th scope="col" className="py-2.5 px-3 text-center">Debar Status</th>
                    <th scope="col" className="py-2.5 px-3 text-right">CAT-1 Marks (50)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((stu) => {
                    const isDebarRisk = stu.attendanceRate < 75;
                    return (
                      <tr key={stu.regNo} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {stu.regNo}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          {stu.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {stu.program}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          {stu.attendanceRate.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                              isDebarRisk
                                ? 'bg-rose-100 text-rose-800 font-bold'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isDebarRisk ? 'Critical Debar Risk' : 'Eligible for Exams'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {stu.cat1Score ? `${stu.cat1Score} / 50` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SYLLABUS & LESSON PLAN */}
        {activeTab === 'syllabus' && (
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Course Syllabus & Topic Tracker</h3>
                <p className="text-xs text-slate-500">
                  Click the checkboxes as lectures are delivered to update official departmental telemetry.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                {completedTopics} of {totalTopics} Topics Completed ({completionPercentage}%)
              </span>
            </div>

            <div className="space-y-4">
              {currentSyllabus.map((unit) => {
                const unitDone = unit.topics.length > 0 && unit.topics.every((t) => t.completed);
                return (
                  <div key={unit.unitNo} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#176CB8] text-white flex items-center justify-center font-bold text-xs">
                          {unit.unitNo}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Unit {unit.unitNo}: {unit.title}
                        </h4>
                      </div>
                      <span className={`text-[11px] font-semibold ${unitDone ? "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200" : "text-slate-500"}`}>{unitDone ? "✓ Unit Completed • " : ""}{unit.hours} Instructional Hours</span>
                    </div>

                    <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-100">
                      {unit.topics.map((topic) => (
                        <label
                          key={topic.id}
                          className="flex items-start gap-2.5 p-1.5 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={topic.completed}
                            onChange={() => handleToggleTopic(topic.id)}
                            className="w-4 h-4 mt-0.5 text-[#176CB8] rounded border-slate-300 focus:ring-[#176CB8] cursor-pointer"
                          />
                          <span
                            className={`text-xs ${
                              topic.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-semibold'
                            }`}
                          >
                            {topic.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MATERIALS & ANNOUNCEMENTS */}
        {activeTab === 'materials' && (
          <div className="p-5 space-y-6">
            {/* Quick Announcement Composer */}
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4">
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#176CB8]" />
                Dispatch Instant Class Notice to Enrolled Students
              </h3>
              <form onSubmit={handlePostAnnouncement} className="space-y-2.5">
                <textarea
                  rows={2}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder={`Post urgent reminder or class advisory to all ${selectedCourse.enrolledCount} students in ${selectedCourse.code}...`}
                  className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Notices appear in student's Campus Spotlight & Digital Assignment alerts.
                  </span>
                  <button
                    type="submit"
                    className="py-1.5 px-4 bg-[#176CB8] hover:bg-[#135796] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Broadcast</span>
                  </button>
                </div>
              </form>

              {announcementSent && (
                <div className="mt-2.5 p-2 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Broadcast dispatched successfully to enrolled students!</span>
                </div>
              )}
            </div>

            {/* Course Material Repository */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Lecture Slides & Reference Artifacts</h3>
                <button
                  type="button"
                  onClick={handleUploadMaterial}
                  className="py-1.5 px-3 bg-white border border-slate-300 hover:border-[#176CB8] text-slate-700 hover:text-[#176CB8] rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Study Material</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {materials.map((mat) => (
                  <div key={mat.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#176CB8] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{mat.title}</span>
                        <span className="text-[11px] text-slate-500">
                          {mat.size} • Uploaded {mat.date} • {mat.downloads} student downloads
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Downloading ${mat.title}...`)}
                      className="p-2 text-slate-500 hover:text-[#176CB8] hover:bg-blue-50 rounded-lg cursor-pointer"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
