import React, { useState } from 'react';
import { PageBreadcrumbHeader } from './PageBreadcrumbHeader';
import {
  MessageSquare,
  Bug,
  Sparkles,
  Zap,
  Layout,
  AlertCircle,
  CheckCircle2,
  Clock,
  Star,
  Send,
  HelpCircle,
  ArrowLeft,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { FeedbackCategory, PortalFeedbackItem } from '../../../types/feedback';
import { getPortalFeedback, addPortalFeedback } from '../../../services/mockFeedbackService';

interface StudentFeedbackPageViewProps {
  onBackToDashboard: () => void;
}

interface CourseFeedbackSubmission {
  courseCode: string;
  courseTitle: string;
  facultyName: string;
  credits: number;
  status: 'Pending' | 'Submitted';
  q1FacultyKnowledge?: number; // 10, 20, 30, 40, 50
  q2ExplainingConcept?: number;
  q3PunctualityAndPace?: number;
  comments?: string;
  submittedAt?: string;
}

const CATEGORIES: { id: FeedbackCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'ui_bug', label: 'UI Bug', icon: Bug },
  { id: 'visual_glitch', label: 'Visual Glitch', icon: AlertCircle },
  { id: 'feature_request', label: 'Feature Request', icon: Sparkles },
  { id: 'performance', label: 'Speed & Lag', icon: Zap },
  { id: 'usability', label: 'Usability / UX', icon: Layout },
  { id: 'general', label: 'General', icon: MessageSquare },
];

const MODULE_OPTIONS = [
  'General Portal UI',
  'Academics / Enrolled Courses',
  'Digital Assignment Desk',
  'Class Attendance Tracker',
  'Timetable & Slots',
  'Examinations (Marks, Grades & Schedule)',
  'Hostel & Gate Pass',
  'Fee Payments & Receipts',
  'Student Profile',
];

export const StudentFeedbackPageView: React.FC<StudentFeedbackPageViewProps> = ({
  onBackToDashboard,
}) => {
  const { user } = useAuth();
  const [mainTab, setMainTab] = useState<'course_eval' | 'ui_feedback'>('course_eval');

  // Course Faculty Feedback State (Matching Prototype Pages 19 & 20)
  const [courseFeedbackList, setCourseFeedbackList] = useState<CourseFeedbackSubmission[]>([
    {
      courseCode: 'CSE4012',
      courseTitle: 'UI UX User Experience Design',
      facultyName: 'Dr. Hussain Syed',
      credits: 4.0,
      status: 'Pending',
    },
    {
      courseCode: 'STS3007',
      courseTitle: 'Advanced Competitive Coding - 1',
      facultyName: 'Ishu Kumar',
      credits: 3.0,
      status: 'Pending',
    },
    {
      courseCode: 'LIB2016',
      courseTitle: 'Human Factors Psychology',
      facultyName: 'Krishna Priya B',
      credits: 3.0,
      status: 'Submitted',
      q1FacultyKnowledge: 50,
      q2ExplainingConcept: 40,
      q3PunctualityAndPace: 50,
      comments: 'Very insightful lectures on sensory ergonomics and cognitive models.',
      submittedAt: '12-Sep-2026',
    },
    {
      courseCode: 'PHY2005',
      courseTitle: 'Introduction to Nanotechnology',
      facultyName: 'K Uma Mahendra Kumar',
      credits: 3.0,
      status: 'Pending',
    },
    {
      courseCode: 'SWE4007',
      courseTitle: 'Software Application Architecture',
      facultyName: 'Dr. Meenakshi S',
      credits: 4.0,
      status: 'Pending',
    },
    {
      courseCode: 'MAT2002',
      courseTitle: 'Discrete Mathematics and Graph Theory',
      facultyName: 'Dr. R. Venkatraman',
      credits: 4.0,
      status: 'Pending',
    },
  ]);

  // Active course evaluation form (Page 20)
  const [activeCourseToEvaluate, setActiveCourseToEvaluate] = useState<CourseFeedbackSubmission | null>(null);
  const [q1Rating, setQ1Rating] = useState<number>(40);
  const [q2Rating, setQ2Rating] = useState<number>(40);
  const [q3Rating, setQ3Rating] = useState<number>(50);
  const [courseComments, setCourseComments] = useState('');
  const [courseSubmitSuccess, setCourseSubmitSuccess] = useState(false);

  // Portal UI Feedback State
  const [allFeedback, setAllFeedback] = useState<PortalFeedbackItem[]>(() => getPortalFeedback());
  const [uiCategory, setUiCategory] = useState<FeedbackCategory>('ui_bug');
  const [uiTargetModule, setUiTargetModule] = useState('General Portal UI');
  const [uiRating, setUiRating] = useState(5);
  const [uiHoverRating, setUiHoverRating] = useState(0);
  const [uiTitle, setUiTitle] = useState('');
  const [uiDescription, setUiDescription] = useState('');
  const [isUiSubmitting, setIsUiSubmitting] = useState(false);
  const [uiSuccessMessage, setUiSuccessMessage] = useState<string | null>(null);

  const studentRegNo = user?.id || '23BCE1088';
  const myUiFeedback = allFeedback.filter((fb) => fb.userRegNo === studentRegNo);

  const handleOpenCourseEvaluation = (course: CourseFeedbackSubmission) => {
    setActiveCourseToEvaluate(course);
    setQ1Rating(course.q1FacultyKnowledge || 40);
    setQ2Rating(course.q2ExplainingConcept || 40);
    setQ3Rating(course.q3PunctualityAndPace || 50);
    setCourseComments(course.comments || '');
    setCourseSubmitSuccess(false);
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourseToEvaluate) return;

    setCourseFeedbackList((prev) =>
      prev.map((c) =>
        c.courseCode === activeCourseToEvaluate.courseCode
          ? {
              ...c,
              status: 'Submitted',
              q1FacultyKnowledge: q1Rating,
              q2ExplainingConcept: q2Rating,
              q3PunctualityAndPace: q3Rating,
              comments: courseComments.trim(),
              submittedAt: 'Today',
            }
          : c
      )
    );

    setCourseSubmitSuccess(true);
    setTimeout(() => {
      setCourseSubmitSuccess(false);
      setActiveCourseToEvaluate(null);
    }, 1500);
  };

  const handleUiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uiTitle.trim() || !uiDescription.trim()) return;

    setIsUiSubmitting(true);
    setTimeout(() => {
      const created = addPortalFeedback({
        userRegNo: studentRegNo,
        userName: user?.name || 'Arjun K Sharma',
        role: user?.role || 'student',
        category: uiCategory,
        targetModule: uiTargetModule,
        rating: uiRating,
        title: uiTitle.trim(),
        description: uiDescription.trim(),
        deviceInfo: typeof navigator !== 'undefined' ? `${navigator.userAgent.slice(0, 45)}...` : 'Web Browser',
      });

      setAllFeedback((prev) => [created, ...prev]);
      setIsUiSubmitting(false);
      setUiSuccessMessage('Your report has been submitted to the VTOP Engineering desk!');
      setUiTitle('');
      setUiDescription('');
      setTimeout(() => {
        setUiSuccessMessage(null);
      }, 3500);
    }, 600);
  };

  const pendingCourseCount = courseFeedbackList.filter((c) => c.status === 'Pending').length;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <PageBreadcrumbHeader
        category="Feedback"
        title="Student Feedback Portal"
        subtitle="Course & faculty instruction evaluation surveys (Fall 2026-27), alongside VTOP 2.0 interface bug reports and suggestions."
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl">
            {pendingCourseCount} Course Survey{pendingCourseCount === 1 ? '' : 's'} Pending
          </span>
        }
      />

      {/* Main Tab Switcher */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 flex gap-1 shadow-xs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mainTab === 'course_eval'}
          onClick={() => {
            setMainTab('course_eval');
            setActiveCourseToEvaluate(null);
          }}
          className={`flex-1 py-3 px-4 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mainTab === 'course_eval'
              ? 'bg-[#176CB8] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Course & Faculty Feedback (Fall 2026-27)</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mainTab === 'ui_feedback'}
          onClick={() => setMainTab('ui_feedback')}
          className={`flex-1 py-3 px-4 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mainTab === 'ui_feedback'
              ? 'bg-[#176CB8] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Portal UI Bug Reports & Suggestions</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. COURSE & FACULTY EVALUATION (PROTOTYPE PAGES 19 & 20)                   */}
      {/* ========================================================================= */}
      {mainTab === 'course_eval' && (
        <div className="space-y-4">
          {activeCourseToEvaluate ? (
            /* PAGE 20: STUDENT FEEDBACK FORM */
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden animate-in fade-in">
              {/* Form Navigation Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-blue-50/20 to-slate-50 border-b border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveCourseToEvaluate(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Courses</span>
                </button>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Course Instruction Survey
                </span>
              </div>

              {/* Course Info Card (Page 20 Top Box) */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Course Code</span>
                    <strong className="font-mono text-sm text-[#176CB8]">{activeCourseToEvaluate.courseCode}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Course Name</span>
                    <strong className="text-slate-900">{activeCourseToEvaluate.courseTitle}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Course Credits</span>
                    <strong className="text-slate-900 font-mono">{activeCourseToEvaluate.credits.toFixed(1)} Credits</strong>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Faculty Instructor</span>
                    <strong className="text-slate-900">{activeCourseToEvaluate.facultyName}</strong>
                  </div>
                </div>
              </div>

              {/* Feedback Questions Body (Page 20) */}
              <div className="p-5 sm:p-6">
                {courseSubmitSuccess ? (
                  <div className="py-8 text-center space-y-2">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Feedback Submitted Successfully!</h3>
                    <p className="text-xs text-slate-600">
                      Your evaluation for {activeCourseToEvaluate.courseCode} has been recorded anonymously.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCourseSubmit} className="space-y-6">
                    <div className="space-y-5">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
                        Feedback Questions (10 = Needs Improvement, 50 = Excellent)
                      </h4>

                      {/* Question 1: Faculty Knowledge */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                        <label className="text-xs font-bold text-slate-900 block">
                          1. Faculty Knowledge & Subject Mastery <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[10, 20, 30, 40, 50].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => setQ1Rating(score)}
                              className={`px-4 py-2 min-h-[40px] text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                                q1Rating === score
                                  ? 'bg-[#183668] text-white border-[#183668] shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {score} pts
                            </button>
                          ))}
                          <span className="text-xs text-slate-500 font-medium ml-2">
                            {q1Rating >= 40 ? 'Very Good / Excellent' : q1Rating >= 30 ? 'Good' : 'Needs Focus'}
                          </span>
                        </div>
                      </div>

                      {/* Question 2: Explaining Concept */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                        <label className="text-xs font-bold text-slate-900 block">
                          2. Explaining Concepts & Interactive Teaching <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[10, 20, 30, 40, 50].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => setQ2Rating(score)}
                              className={`px-4 py-2 min-h-[40px] text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                                q2Rating === score
                                  ? 'bg-[#183668] text-white border-[#183668] shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {score} pts
                            </button>
                          ))}
                          <span className="text-xs text-slate-500 font-medium ml-2">
                            {q2Rating >= 40 ? 'Clear & Engaging' : q2Rating >= 30 ? 'Adequate' : 'Fast Paced'}
                          </span>
                        </div>
                      </div>

                      {/* Question 3: Pace & Material Quality */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                        <label className="text-xs font-bold text-slate-900 block">
                          3. Punctuality, Syllabus Coverage & Lecture Materials <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[10, 20, 30, 40, 50].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => setQ3Rating(score)}
                              className={`px-4 py-2 min-h-[40px] text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                                q3Rating === score
                                  ? 'bg-[#183668] text-white border-[#183668] shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {score} pts
                            </button>
                          ))}
                          <span className="text-xs text-slate-500 font-medium ml-2">
                            {q3Rating >= 40 ? 'On Time & Comprehensive' : 'Acceptable'}
                          </span>
                        </div>
                      </div>

                      {/* Additional Comments (Page 20) */}
                      <div>
                        <label htmlFor="course-feedback-comments" className="text-xs font-bold text-slate-900 block mb-1.5">
                          Additional Comments / Constructive Suggestions
                        </label>
                        <textarea
                          id="course-feedback-comments"
                          rows={3}
                          placeholder="Share your experience, specific topics where more examples would help, or commendations..."
                          value={courseComments}
                          onChange={(e) => setCourseComments(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:bg-white text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Survey responses are anonymized and aggregated at department level.
                      </span>
                      <button
                        type="submit"
                        className="px-6 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] shadow-xs transition-colors cursor-pointer"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* PAGE 19: STUDENT FEEDBACK COURSE LIST */
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Course Instruction Surveys (Fall Semester 2026-27)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluate teaching effectiveness, syllabus coverage, and learning resources for each registered subject.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#176CB8] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 self-start sm:self-auto">
                  {courseFeedbackList.filter((c) => c.status === 'Submitted').length} / {courseFeedbackList.length} Completed
                </span>
              </div>

              {/* Table Matching Prototype Page 19 */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                      <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                      <th scope="col" className="py-3 px-4 min-w-[120px]">Course Code</th>
                      <th scope="col" className="py-3 px-4 min-w-[240px]">Course Name</th>
                      <th scope="col" className="py-3 px-4 min-w-[180px]">Course Faculty</th>
                      <th scope="col" className="py-3 px-4 text-center min-w-[100px]">Status</th>
                      <th scope="col" className="py-3 px-4 text-right min-w-[130px]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courseFeedbackList.map((c, idx) => (
                      <tr key={c.courseCode} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                            {c.courseCode}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {c.courseTitle}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {c.facultyName}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {c.status === 'Submitted' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Submitted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenCourseEvaluation(c)}
                            className={`inline-flex items-center gap-1 px-3.5 py-1.5 min-h-[36px] rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              c.status === 'Submitted'
                                ? 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                                : 'text-white bg-[#176CB8] hover:bg-[#135796] shadow-2xs'
                            }`}
                          >
                            <span>{c.status === 'Submitted' ? 'Edit Survey' : 'Feedback'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PORTAL UI FEEDBACK & BUG REPORTING                                    */}
      {/* ========================================================================= */}
      {mainTab === 'ui_feedback' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
            {uiSuccessMessage && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span className="font-semibold">{uiSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleUiSubmit} className="space-y-5">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Feedback Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = uiCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setUiCategory(cat.id)}
                        className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#183668] text-white border-[#183668] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-200' : 'text-slate-500'}`} />
                        <span className="text-xs font-semibold">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Module and Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="student-feedback-module" className="block text-xs font-bold text-slate-800 mb-2">
                    Portal Module / Screen <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="student-feedback-module"
                    value={uiTargetModule}
                    onChange={(e) => setUiTargetModule(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-800"
                  >
                    {MODULE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Overall Portal Satisfaction Rating
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setUiHoverRating(star)}
                        onMouseLeave={() => setUiHoverRating(0)}
                        onClick={() => setUiRating(star)}
                        className="p-1 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-all ${
                            (uiHoverRating || uiRating) >= star
                              ? 'text-amber-400 fill-amber-400 scale-105'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold font-mono text-slate-700 ml-3">
                      {uiRating} / 5 Stars
                    </span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="student-feedback-title" className="block text-xs font-bold text-slate-800 mb-2">
                  Feedback Summary / Bug Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  id="student-feedback-title"
                  type="text"
                  placeholder="e.g. Timetable export to PDF cuts off Saturday or DA table layout feedback"
                  value={uiTitle}
                  onChange={(e) => setUiTitle(e.target.value)}
                  className="w-full px-4 py-2.5 min-h-[44px] text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:bg-white text-slate-900"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="student-feedback-desc" className="block text-xs font-bold text-slate-800 mb-2">
                  Detailed Feedback Description & Steps to Reproduce <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="student-feedback-desc"
                  rows={4}
                  placeholder="Provide details about what you experienced or what changes would make the portal smoother..."
                  value={uiDescription}
                  onChange={(e) => setUiDescription(e.target.value)}
                  className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:bg-white text-slate-900"
                  required
                />
              </div>

              {/* Submit */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                  <HelpCircle className="w-3.5 h-3.5 text-[#176CB8]" />
                  <span>Session ID: {studentRegNo}</span>
                </div>

                <button
                  type="submit"
                  disabled={isUiSubmitting}
                  className="px-6 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] shadow-xs transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isUiSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send UI Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Submissions History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              My UI Feedback Tickets ({myUiFeedback.length})
            </h4>
            {myUiFeedback.map((fb) => (
              <div
                key={fb.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#176CB8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {fb.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {fb.targetModule}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-blue-50 text-blue-800 border-blue-200">
                    {fb.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{fb.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{fb.description}</p>
                </div>
                {fb.adminNotes && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 italic">
                    <strong>Admin Response:</strong> "{fb.adminNotes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
