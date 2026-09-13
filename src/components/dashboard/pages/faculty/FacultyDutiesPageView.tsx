import React, { useState } from 'react';
import { PageBreadcrumbHeader } from '../PageBreadcrumbHeader';
import {
  MOCK_FACULTY_INVIGILATIONS,
  MOCK_FACULTY_DUTY_LEAVES,
} from '../../../../services/mockFacultyService';
import { InvigilationDuty, FacultyDutyLeave } from '../../../../types/faculty';
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  CheckCircle2,
  Plus,
  Send,
} from 'lucide-react';

interface FacultyDutiesPageViewProps {
  onBackToDashboard: () => void;
}

export const FacultyDutiesPageView: React.FC<FacultyDutiesPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [duties] = useState<InvigilationDuty[]>(MOCK_FACULTY_INVIGILATIONS);
  const [leaves, setLeaves] = useState<FacultyDutyLeave[]>(MOCK_FACULTY_DUTY_LEAVES);
  const [isApplyingLeave, setIsApplyingLeave] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [substitute, setSubstitute] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason || !leaveFrom || !leaveTo) return;

    const newLeave: FacultyDutyLeave = {
      id: `leave-fac-${Date.now()}`,
      leaveType: 'On-Duty (Conference/Seminar)',
      fromDate: leaveFrom,
      toDate: leaveTo,
      totalDays: 2,
      reason: leaveReason,
      status: 'Pending Dean Review',
      substituteFaculty: substitute || 'Dr. K. Srinivas (SCOPE)',
    };

    setLeaves((prev) => [newLeave, ...prev]);
    setIsApplyingLeave(false);
    setLeaveReason('');
    setLeaveFrom('');
    setLeaveTo('');
    setSubstitute('');
    setToastMessage('Faculty Duty Leave application submitted for Dean approval.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageBreadcrumbHeader
        category="Faculty Services"
        title="Examination Duties & Faculty Leave Desk"
        subtitle="Invigilation Allocations, Exam Center Directives, and On-Duty Leave Management"
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <button
            type="button"
            onClick={() => alert('Downloading official Examination Invigilation Order PDF...')}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Duty Orders (PDF)</span>
          </button>
        }
      />

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Invigilation Duties Schedule */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
              <span>Controller of Examinations (COE) Invigilation Duties</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Please report to the COE Dispatch Office 30 minutes prior to session start.
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {duties.length} Duties Assigned
          </span>
        </div>

        <div className="space-y-3">
          {duties.map((duty) => (
            <div
              key={duty.id}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">
                    {duty.courseCode} — {duty.courseTitle}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {duty.examType}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span className="tabular-nums">{duty.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span className="tabular-nums">{duty.session}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span>{duty.hall}</span>
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Reporting: <strong>{duty.reportingTime}</strong> • Chief Superintendent: {duty.chiefSuperintendent}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => alert(`Invigilation pass verified for Hall ${duty.hall}`)}
                  className="px-3.5 py-2 min-h-[44px] rounded-xl bg-[#183668] hover:bg-[#12284C] active:scale-[0.98] text-white text-xs font-bold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
                >
                  View Hall Roster
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Duty Leave Management */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Faculty Duty Leave & Academic Travel Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Apply for On-Duty (OD) approval for conferences, doctoral defenses, or research visits.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsApplyingLeave(!isApplyingLeave)}
            className="px-3.5 py-2 min-h-[44px] rounded-lg bg-blue-50 hover:bg-blue-100 active:scale-[0.98] text-[#176CB8] font-bold text-xs transition-all cursor-pointer flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isApplyingLeave ? 'Cancel' : 'Apply On-Duty Leave'}</span>
          </button>
        </div>

        {isApplyingLeave && (
          <form
            onSubmit={handleApplyLeave}
            className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3 animate-in fade-in duration-150"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="leave-from"
                  className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  From Date
                </label>
                <input
                  id="leave-from"
                  type="date"
                  required
                  value={leaveFrom}
                  onChange={(e) => setLeaveFrom(e.target.value)}
                  className="w-full px-3 py-2 min-h-[44px] text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
                />
              </div>

              <div>
                <label
                  htmlFor="leave-to"
                  className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  To Date
                </label>
                <input
                  id="leave-to"
                  type="date"
                  required
                  value={leaveTo}
                  onChange={(e) => setLeaveTo(e.target.value)}
                  className="w-full px-3 py-2 min-h-[44px] text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
                />
              </div>

              <div>
                <label
                  htmlFor="substitute-faculty"
                  className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Slot Substitute Faculty
                </label>
                <input
                  id="substitute-faculty"
                  type="text"
                  value={substitute}
                  onChange={(e) => setSubstitute(e.target.value)}
                  placeholder="e.g. Dr. K. Srinivas (SCOPE)"
                  className="w-full px-3 py-2 min-h-[44px] text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="leave-reason"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Academic Purpose & Conference Details
              </label>
              <textarea
                id="leave-reason"
                rows={2}
                required
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="e.g. Presenting paper on Neural UX Models at IEEE International Symposium..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 min-h-[44px] rounded-xl bg-[#183668] hover:bg-[#12284C] active:scale-[0.98] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Submit to Dean's Office</span>
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2.5">
          {leaves.map((l) => (
            <div
              key={l.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{l.leaveType}</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {l.fromDate} to {l.toDate} ({l.totalDays} Days)
                  </span>
                </div>
                <p className="text-slate-600 italic">"{l.reason}"</p>
                <div className="text-[11px] text-slate-500">
                  Substitute Faculty: <strong>{l.substituteFaculty}</strong>
                </div>
              </div>

              <div className="shrink-0">
                <span
                  className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                    l.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {l.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
