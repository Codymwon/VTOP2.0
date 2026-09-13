import React, { useState } from 'react';
import { PageBreadcrumbHeader } from '../PageBreadcrumbHeader';
import { MOCK_FACULTY_PENDING_GRADING } from '../../../../services/mockFacultyService';
import { PendingGradingItem } from '../../../../types/faculty';
import {
  CheckCircle2,
  Send,
  X,
  Search,
  Download,
} from 'lucide-react';

interface FacultyGradingPageViewProps {
  onBackToDashboard: () => void;
}

export const FacultyGradingPageView: React.FC<FacultyGradingPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [items, setItems] = useState<PendingGradingItem[]>(MOCK_FACULTY_PENDING_GRADING);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'graded'>('pending');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active grading modal
  const [activeModalItem, setActiveModalItem] = useState<PendingGradingItem | null>(null);
  const [scoreInput, setScoreInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (activeTab === 'pending' && item.status !== 'Pending') return false;
    if (activeTab === 'graded' && item.status !== 'Graded') return false;
    if (courseFilter !== 'ALL' && item.courseCode !== courseFilter) return false;
    if (
      searchQuery &&
      !item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.studentRegNo.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalItem) return;

    const val = parseFloat(scoreInput);
    if (isNaN(val) || val < 0 || val > activeModalItem.maxMarks) {
      alert(`Score must be between 0 and ${activeModalItem.maxMarks}`);
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.id === activeModalItem.id
          ? { ...i, status: 'Graded', score: val, feedback: feedbackInput }
          : i
      )
    );
    setToastMessage(`Graded ${activeModalItem.studentName}: ${val}/${activeModalItem.maxMarks}`);
    setActiveModalItem(null);
    setScoreInput('');
    setFeedbackInput('');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageBreadcrumbHeader
        category="Evaluations"
        title="Continuous Evaluation & Marks Entry"
        subtitle="Digital Assignment Submissions, CAT/FAT Marks Rosters, and Automated Rubrics"
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <button
            type="button"
            onClick={() => alert('Downloading gradebook spreadsheet...')}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Export Gradebook</span>
          </button>
        }
      />

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Tab Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                activeTab === 'pending'
                  ? 'bg-white text-[#183668] shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Pending Evaluation ({items.filter((i) => i.status === 'Pending').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('graded')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                activeTab === 'graded'
                  ? 'bg-white text-[#183668] shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Graded Submissions ({items.filter((i) => i.status === 'Graded').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                activeTab === 'all'
                  ? 'bg-white text-[#183668] shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              All Items ({items.length})
            </button>
          </div>

          {/* Course and Search filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 min-h-[44px] text-xs rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] font-bold"
            >
              <option value="ALL">All Assigned Courses</option>
              <option value="CSE4012">CSE4012 (HCI)</option>
              <option value="CSE3002">CSE3002 (Web Prog)</option>
              <option value="SWE2005">SWE2005 (Software Arch)</option>
            </select>

            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or DA..."
                className="w-full pl-8 pr-3 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="py-2.5 px-3">Student Details</th>
                <th scope="col" className="py-2.5 px-3">Course & Component</th>
                <th scope="col" className="py-2.5 px-3">Assignment Title</th>
                <th scope="col" className="py-2.5 px-3">Submitted File</th>
                <th scope="col" className="py-2.5 px-3 text-center">Score / Max</th>
                <th scope="col" className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isPending = item.status === 'Pending';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.studentName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{item.studentRegNo}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-800">{item.courseCode}</span>
                      <span className="text-[10px] font-bold ml-1.5 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        {item.componentType}
                      </span>
                    </td>

                    <td className="py-3 px-3 max-w-xs font-semibold text-slate-800">
                      {item.assignmentTitle}
                      <div className="text-[10px] text-slate-500 mt-0.5">Submitted: {item.submittedDate}</div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {item.fileDetails || 'Script Verified'}
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 tabular-nums">
                      {item.status === 'Graded' ? (
                        <span className="text-emerald-800 font-black text-sm">
                          {item.score} / {item.maxMarks}
                        </span>
                      ) : (
                        <span className="text-slate-500">— / {item.maxMarks}</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveModalItem(item);
                            setScoreInput('');
                            setFeedbackInput('');
                          }}
                          className="px-3.5 py-2 min-h-[40px] rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-bold text-xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                        >
                          Grade Now
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveModalItem(item);
                            setScoreInput(item.score?.toString() || '');
                            setFeedbackInput(item.feedback || '');
                          }}
                          className="px-3.5 py-2 min-h-[40px] rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-semibold text-xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
                        >
                          Edit Grade
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            role="presentation"
            onClick={() => setActiveModalItem(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          <div
            role="dialog"
            aria-labelledby="grading-dialog-title"
            aria-modal="true"
            className="relative z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 id="grading-dialog-title" className="text-sm font-bold text-slate-900">
                  Evaluate: {activeModalItem.studentName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {activeModalItem.studentRegNo} • {activeModalItem.courseCode} ({activeModalItem.componentType})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                aria-label="Close dialog"
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="font-semibold text-slate-800">{activeModalItem.assignmentTitle}</div>
              <div className="text-slate-500 font-mono">Attachment: {activeModalItem.fileDetails}</div>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-3">
              <div>
                <label
                  htmlFor="marks-field"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Marks Awarded (Max: {activeModalItem.maxMarks})
                </label>
                <input
                  id="marks-field"
                  type="number"
                  step="0.5"
                  min="0"
                  max={activeModalItem.maxMarks}
                  required
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  placeholder={`0 to ${activeModalItem.maxMarks}`}
                  className="w-full px-3 py-2 min-h-[44px] text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] font-mono font-bold"
                />
              </div>

              <div>
                <label
                  htmlFor="feedback-field"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Rubrics Feedback
                </label>
                <textarea
                  id="feedback-field"
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Provide qualitative guidance and marks justification..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 min-h-[44px] rounded-xl bg-[#183668] hover:bg-[#12284C] text-white text-xs font-bold active:scale-[0.98] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Lock & Submit Score</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
