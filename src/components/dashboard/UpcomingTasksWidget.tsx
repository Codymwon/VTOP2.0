import React from 'react';
import { DigitalAssignmentItem } from '../../types/dashboard';
import { FileText, Clock, CheckCircle, UploadCloud, ChevronRight } from 'lucide-react';

interface UpcomingTasksWidgetProps {
  assignments: DigitalAssignmentItem[];
  onOpenAssignments: () => void;
}

export const UpcomingTasksWidget: React.FC<UpcomingTasksWidgetProps> = ({
  assignments,
  onOpenAssignments,
}) => {
  // Show top 4 tasks on overview to maintain layout balance
  const displayedAssignments = assignments.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Digital Assignments & Tasks
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Continuous Assessment Submissions
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAssignments}
          className="text-xs font-bold text-[#176CB8] hover:text-[#2455A3] hover:underline flex items-center gap-1 min-h-[44px] px-2.5 py-1.5 rounded-lg active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
        >
          <span>All Tasks ({assignments.length})</span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Assignment List */}
      <div className="space-y-2.5">
        {displayedAssignments.map((task) => {
          const isPending = task.status === 'Pending';
          const isUploaded = task.status === 'Uploaded';

          return (
            <div
              key={task.id}
              className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-2xs transition-all flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isPending
                      ? 'bg-amber-100/80 text-amber-800'
                      : isUploaded
                      ? 'bg-blue-100/80 text-blue-800'
                      : 'bg-emerald-100/80 text-emerald-800'
                  }`}
                >
                  {isPending ? (
                    <Clock className="w-4 h-4" aria-hidden="true" />
                  ) : isUploaded ? (
                    <UploadCloud className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    {task.title}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 tabular-nums">
                    <span className="font-bold text-[#176CB8] mr-1">{task.courseCode}</span>• Max: {task.maxMarks} marks (Weightage {task.weightage}%)
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-0.5 ${
                    isPending
                      ? 'bg-amber-50 text-amber-800 border border-amber-300'
                      : isUploaded
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {task.status}
                </span>
                <span className="text-[11px] text-slate-500 font-medium block tabular-nums">
                  Due: {task.dueDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
