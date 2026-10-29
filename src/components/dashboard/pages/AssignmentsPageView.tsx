import React, { useState } from 'react';
import { PageBreadcrumbHeader } from './PageBreadcrumbHeader';
import { DigitalAssignmentItem } from '../../../types/dashboard';
import { MOCK_DIGITAL_ASSIGNMENTS } from '../../../services/mockDashboardService';
import { AssignmentCoverSheetModal } from '../AssignmentCoverSheetModal';
import {
  Upload,
  Clock,
  CheckCircle2,
  FileText,
  Download,
  X,
  FileDown,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

interface AssignmentsPageViewProps {
  onBackToDashboard: () => void;
}

const COURSE_METADATA: Record<string, { faculty: string; type: string }> = {
  CSE4012: { faculty: 'Dr. Hussain Syed', type: 'Embedded Theory & Lab' },
  LIB2016: { faculty: 'Krishna Priya B', type: 'Theory Only' },
  PHY2005: { faculty: 'K Uma Mahendra Kumar', type: 'Theory Only' },
  STS3007: { faculty: 'Ishu Kumar', type: 'Theory Only' },
  SWE4007: { faculty: 'Dr. Meenakshi S', type: 'Embedded Theory' },
  MAT2002: { faculty: 'Dr. R. Venkatraman', type: 'Theory Only' },
};

export const AssignmentsPageView: React.FC<AssignmentsPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [assignments, setAssignments] = useState<DigitalAssignmentItem[]>(MOCK_DIGITAL_ASSIGNMENTS);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'uploaded' | 'graded'>('all');

  // Cover Sheet Modal State
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [coverDefaultCourse, setCoverDefaultCourse] = useState('CSE4012');

  // Upload Modal State
  const [activeUploadItem, setActiveUploadItem] = useState<DigitalAssignmentItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Close upload modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeUploadItem) {
        setActiveUploadItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeUploadItem]);

  // Distinct courses with their deliverables
  const coursesList = Array.from(new Set(assignments.map((a) => a.courseCode))).map((code) => {
    const courseAssignments = assignments.filter((a) => a.courseCode === code);
    return {
      code,
      title: courseAssignments[0]?.courseTitle || code,
      totalCount: courseAssignments.length,
      pendingCount: courseAssignments.filter((a) => a.status === 'Pending').length,
      uploadedCount: courseAssignments.filter((a) => a.status === 'Uploaded' || a.status === 'Graded').length,
      faculty: COURSE_METADATA[code]?.faculty || 'Department Faculty',
    };
  });

  const handleOpenUpload = (item: DigitalAssignmentItem) => {
    setActiveUploadItem(item);
    setSelectedFile(null);
    setIsAgreed(false);
    setUploadSuccessMessage(null);
  };

  const handleSimulateSubmit = () => {
    if (!activeUploadItem || !selectedFile || !isAgreed) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setAssignments((prev) =>
        prev.map((item) =>
          item.id === activeUploadItem.id
            ? {
                ...item,
                status: 'Uploaded',
                fileDetails: `${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)`,
              }
            : item
        )
      );
      setUploadSuccessMessage(`Successfully uploaded "${selectedFile.name}" to VTOP Academic Server.`);
      setTimeout(() => {
        setActiveUploadItem(null);
      }, 1500);
    }, 1000);
  };

  const handleOpenCoverSheet = (courseCode: string) => {
    setCoverDefaultCourse(courseCode);
    setIsCoverModalOpen(true);
  };

  // Filtered assignments when viewing inside a specific course or all
  const displayedAssignments = assignments.filter((a) => {
    const matchesCourse = selectedCourseCode ? a.courseCode === selectedCourseCode : true;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && a.status === 'Pending') ||
      (statusFilter === 'uploaded' && a.status === 'Uploaded') ||
      (statusFilter === 'graded' && a.status === 'Graded');

    return matchesCourse && matchesStatus;
  });

  const totalPending = assignments.filter((a) => a.status === 'Pending').length;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <PageBreadcrumbHeader
        category="Academics"
        title="Digital Assignment Submissions"
        subtitle="Coursework deliverable schedule, evaluation status, question papers, and official cover sheet generator."
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenCoverSheet(selectedCourseCode || 'CSE4012')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 min-h-[44px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] shadow-xs transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Assignment Cover Sheet</span>
            </button>
            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl">
              {totalPending} Deliverable{totalPending === 1 ? '' : 's'} Due
            </span>
          </div>
        }
      />

      {/* ========================================================================= */}
      {/* VIEW 1: PROTOTYPE PAGE 6 - COURSE DIRECTORY OVERVIEW                      */}
      {/* ========================================================================= */}
      {!selectedCourseCode ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden space-y-0">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Digital Assignment Courses (Fall Semester 2026-27)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select a course to view assignment deliverables, question papers, and submission portals.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-[#176CB8] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              {coursesList.length} Courses Registered
            </div>
          </div>

          {/* Table Matching Prototype Page 6 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4 w-12 text-center">S.No</th>
                  <th scope="col" className="py-3 px-4 min-w-[120px]">Course Code</th>
                  <th scope="col" className="py-3 px-4 min-w-[260px]">Course Title</th>
                  <th scope="col" className="py-3 px-4 min-w-[180px]">Faculty Instructor</th>
                  <th scope="col" className="py-3 px-4 text-center min-w-[110px]">Deliverables</th>
                  <th scope="col" className="py-3 px-4 text-center min-w-[100px]">Pending</th>
                  <th scope="col" className="py-3 px-4 text-right min-w-[110px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coursesList.map((c, idx) => (
                  <tr key={c.code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {c.faculty}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">
                      {c.totalCount} Tasks
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {c.pendingCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          {c.pendingCount} Due
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          All Done
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCourseCode(c.code)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 min-h-[36px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] shadow-2xs transition-all cursor-pointer"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: PROTOTYPE PAGE 7 - COURSE DIGITAL ASSIGNMENT UPLOAD               */
        /* ========================================================================= */
        <div className="space-y-4 animate-in fade-in">
          {/* Header Strip with Back to Courses button and Course Info (Page 7) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedCourseCode(null)}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[36px] text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Courses</span>
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#176CB8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedCourseCode}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {assignments.find((a) => a.courseCode === selectedCourseCode)?.courseTitle || selectedCourseCode}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Faculty Instructor: <strong>{COURSE_METADATA[selectedCourseCode]?.faculty || 'Dr. Hussain Syed'}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Status Filter for current course */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 px-3 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['all', 'pending', 'uploaded', 'graded'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'all' ? 'All Deliverables' : st}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-slate-500">
              Showing {displayedAssignments.length} items
            </span>
          </div>

          {/* Table Matching Prototype Page 7 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4 w-12 text-center">S.No</th>
                    <th scope="col" className="py-3 px-4 min-w-[220px]">Assignment Name</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[90px]">Max Marks</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[80px]">Weightage</th>
                    <th scope="col" className="py-3 px-4 min-w-[120px]">Due Date</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[100px]">QP Download</th>
                    <th scope="col" className="py-3 px-4 min-w-[140px]">Deliverable File</th>
                    <th scope="col" className="py-3 px-4 text-center min-w-[100px]">Status</th>
                    <th scope="col" className="py-3 px-4 text-right min-w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedAssignments.map((a, idx) => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {a.title}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                        {a.maxMarks}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        {a.weightage}%
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        <div>{a.dueDate}</div>
                        <span className="text-[10px] text-slate-500">11:59 PM IST</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => alert(`Downloading verified question paper for: ${a.title}`)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#176CB8] hover:underline cursor-pointer py-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>QP.pdf</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        {a.fileDetails ? (
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-mono">
                            <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate max-w-[130px]" title={a.fileDetails}>
                              {a.fileDetails}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No file submitted</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {a.status === 'Uploaded' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Submitted
                          </span>
                        ) : a.status === 'Graded' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                            <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                            Graded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Due in {a.daysRemaining}d
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {a.status === 'Pending' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenUpload(a)}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 min-h-[36px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] shadow-2xs transition-colors cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload</span>
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenUpload(a)}
                              className="px-2.5 py-1.5 min-h-[36px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                              View / Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => alert(`Downloading verified submission receipt for: ${a.fileDetails || a.title}`)}
                              className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Download Receipt"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Upload Modal */}
      {activeUploadItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-assignment-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#176CB8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {activeUploadItem.courseCode}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">Digital Assignment Desk</span>
                </div>
                <h3 id="upload-assignment-title" className="text-base font-bold text-slate-900 mt-1">
                  {activeUploadItem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveUploadItem(null)}
                aria-label="Close upload dialog"
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {uploadSuccessMessage ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Upload Confirmed</h4>
                  <p className="text-xs text-slate-600 font-mono">{uploadSuccessMessage}</p>
                </div>
              ) : (
                <>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 hover:border-[#176CB8] transition-colors bg-slate-50/50">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto" aria-hidden="true" />
                    <div>
                      <label htmlFor="file-upload-input" className="text-xs font-bold text-[#176CB8] hover:underline cursor-pointer">
                        Click to select document
                      </label>
                      <input
                        id="file-upload-input"
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                        className="sr-only"
                      />
                      <span className="text-xs text-slate-500 block mt-0.5">
                        PDF or DOCX (Max: 4.0 MB)
                      </span>
                    </div>

                    {selectedFile && (
                      <div className="inline-flex items-center gap-2 p-2 px-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#176CB8] font-mono font-bold mt-2">
                        <FileText className="w-4 h-4" aria-hidden="true" />
                        <span>{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 pt-2">
                    <input
                      id="academic-declaration-check"
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#176CB8] focus:ring-[#176CB8]"
                    />
                    <label htmlFor="academic-declaration-check" className="text-xs text-slate-600 leading-snug">
                      I certify that this submission contains my authentic work and includes the standard front cover sheet with my register number.
                    </label>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveUploadItem(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!selectedFile || !isAgreed || isUploading}
                      onClick={handleSimulateSubmit}
                      className="px-5 py-2 text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] rounded-xl shadow-xs cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isUploading ? 'Uploading to Server...' : 'Submit Deliverable'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assignment Cover Sheet Generator Modal */}
      <AssignmentCoverSheetModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        defaultCourseCode={coverDefaultCourse}
      />
    </div>
  );
};
