import React, { useState } from 'react';
import { PageBreadcrumbHeader } from './PageBreadcrumbHeader';
import { DigitalAssignmentItem } from '../../../types/dashboard';
import { MOCK_DIGITAL_ASSIGNMENTS } from '../../../services/mockDashboardService';
import {
  Upload,
  Clock,
  CheckCircle2,
  FileText,
  Download,
  X,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface AssignmentsPageViewProps {
  onBackToDashboard: () => void;
}

export const AssignmentsPageView: React.FC<AssignmentsPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [assignments, setAssignments] = useState<DigitalAssignmentItem[]>(MOCK_DIGITAL_ASSIGNMENTS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'uploaded' | 'graded'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

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

  const courses = Array.from(new Set(assignments.map((a) => a.courseCode)));

  const filteredAssignments = assignments.filter((a) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && a.status === 'Pending') ||
      (statusFilter === 'uploaded' && a.status === 'Uploaded') ||
      (statusFilter === 'graded' && a.status === 'Graded');

    const matchesCourse = courseFilter === 'all' || a.courseCode === courseFilter;
    return matchesStatus && matchesCourse;
  });

  const pendingCount = assignments.filter((a) => a.status === 'Pending').length;
  const uploadedCount = assignments.filter((a) => a.status === 'Uploaded').length;
  const gradedCount = assignments.filter((a) => a.status === 'Graded').length;

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

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <PageBreadcrumbHeader
        category="Academics"
        title="Digital Assignment Submissions"
        subtitle="Upload and manage coursework deliverables, view evaluation status, and download receipts."
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl">
            {pendingCount} Deliverable{pendingCount === 1 ? '' : 's'} Due
          </span>
        }
      />

      {/* Institutional Guidelines Alert */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#176CB8] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              Institutional Submission Guidelines (Fall Semester 2026-27)
            </h3>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Submissions must be in <strong>PDF</strong> or <strong>DOCX</strong> format (Max file size: <strong>4.0 MB</strong>). Ensure your <strong>Register Number (23BCE1088)</strong> and <strong>Name</strong> are included as headers on the first page. Late submissions after 11:59 PM on the due date are automatically locked.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs text-slate-600 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span>Academic Integrity Protected</span>
        </div>
      </div>

      {/* Filter and Tabs Strip */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl flex-wrap" role="tablist" aria-label="Assignment Status Filter">
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({assignments.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'pending'}
            onClick={() => setStatusFilter('pending')}
            className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Due / Pending ({pendingCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'uploaded'}
            onClick={() => setStatusFilter('uploaded')}
            className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
              statusFilter === 'uploaded'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submitted ({uploadedCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'graded'}
            onClick={() => setStatusFilter('graded')}
            className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
              statusFilter === 'graded'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Graded ({gradedCount})
          </button>
        </div>

        {/* Course Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="course-select-filter" className="text-xs font-semibold text-slate-600">Course:</label>
          <select
            id="course-select-filter"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            aria-label="Filter assignments by course"
            className="px-3 py-2 min-h-[44px] text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-800"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Digital Assignments List">
        {filteredAssignments.map((a) => (
          <div
            key={a.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[#176CB8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {a.courseCode}
                </span>

                {a.status === 'Uploaded' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                    Submitted
                  </span>
                ) : a.status === 'Graded' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    <CheckCircle2 className="w-3 h-3 text-indigo-600" aria-hidden="true" />
                    Graded (8.0 / 10)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-600" aria-hidden="true" />
                    Due in {a.daysRemaining} days
                  </span>
                )}
              </div>

              {/* Title */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {a.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{a.courseTitle}</p>
              </div>

              {/* Meta details */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl text-center font-mono text-xs border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block font-sans">Max Marks</span>
                  <strong className="text-slate-900">{a.maxMarks}</strong>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] text-slate-500 font-medium block font-sans">Weightage</span>
                  <strong className="text-slate-900">{a.weightage}%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block font-sans">Deadline</span>
                  <strong className="text-slate-900 text-[11px]">{a.dueDate}</strong>
                </div>
              </div>

              {/* File details if uploaded */}
              {a.fileDetails && (
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span className="font-mono text-[11px] truncate flex-1">
                    {a.fileDetails}
                  </span>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading verified receipt for: ${a.fileDetails}`)}
                    title="Download submission receipt"
                    aria-label={`Download verified submission receipt for ${a.fileDetails}`}
                    className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-emerald-700 hover:text-emerald-900 font-bold p-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {/* Actions Button */}
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Deadline: 11:59 PM IST
              </span>

              {a.status === 'Pending' ? (
                <button
                  type="button"
                  onClick={() => handleOpenUpload(a)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Upload Deliverable</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenUpload(a)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Re-upload</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Upload Modal */}
      {activeUploadItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-assignment-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Modal Header */}
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
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {uploadSuccessMessage ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Submission Accepted!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">{uploadSuccessMessage}</p>
                </div>
              ) : (
                <>
                  {/* File Dropzone */}
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#176CB8] hover:bg-blue-50/20 transition-all">
                    <input
                      type="file"
                      id="assignment-file-input"
                      accept=".pdf,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 4 * 1024 * 1024) {
                            alert('File exceeds maximum limit of 4.0 MB. Please compress your document.');
                            return;
                          }
                          setSelectedFile(file);
                        }
                      }}
                      className="sr-only"
                    />
                    <label
                      htmlFor="assignment-file-input"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-[#176CB8] flex items-center justify-center">
                        <Upload className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {selectedFile ? selectedFile.name : 'Click to select file or drag and drop'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        PDF or DOCX only (Maximum 4.0 MB)
                      </span>
                      {selectedFile && (
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Validated
                        </span>
                      )}
                    </label>
                  </div>

                  {/* Academic Integrity Checkbox */}
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded text-[#176CB8] focus:ring-[#176CB8] cursor-pointer"
                    />
                    <span>
                      I declare that this deliverable is my original academic work for <strong>23BCE1088</strong> in accordance with the VIT-AP University Honor Code.
                    </span>
                  </label>
                </>
              )}
            </div>

            {/* Modal Footer */}
            {!uploadSuccessMessage && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveUploadItem(null)}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedFile || !isAgreed || isUploading}
                  onClick={handleSimulateSubmit}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
                >
                  {isUploading ? (
                    <span>Uploading...</span>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Submit Assignment</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
