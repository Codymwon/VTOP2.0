import React, { useState } from 'react';
import {
  MOCK_ADMIN_KPIS,
  MOCK_ADMIN_OUTING_REQUESTS,
  MOCK_ADMIN_GATE_LOGS,
  MOCK_ADMIN_CIRCULARS,
} from '../../../services/mockAdminService';
import {
  AdminOutingRequest,
  EmergencyCircular,
} from '../../../types/admin';
import {
  Users,
  Building2,
  GraduationCap,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Radio,
  CheckCheck,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
} from 'lucide-react';

interface AdminDashboardViewProps {
  onNavigateTo: (sectionId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigateTo }) => {
  // Outing requests state
  const [outingRequests, setOutingRequests] = useState<AdminOutingRequest[]>(
    MOCK_ADMIN_OUTING_REQUESTS
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Circulars broadcast publisher state
  const [circulars, setCirculars] = useState<EmergencyCircular[]>(MOCK_ADMIN_CIRCULARS);
  const [isPublishingNew, setIsPublishingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newAudience, setNewAudience] = useState<'All University' | 'All Students' | 'All Faculty' | 'Hostellers Only'>('All University');
  const [newPriority, setNewPriority] = useState<'Emergency' | 'Urgent' | 'Info'>('Urgent');

  // Single Approve
  const handleApprove = (requestId: string) => {
    const req = outingRequests.find((r) => r.id === requestId);
    if (!req) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOutingRequests((prev) =>
      prev.map((item) =>
        item.id === requestId
          ? {
              ...item,
              status: 'Approved',
              decisionTimestamp: `Approved today at ${now} by Registrar Office`,
            }
          : item
      )
    );
    setStatusMessage(`Approved gate pass for ${req.studentName} (${req.studentRegNo}). Biometric turnstiles unlocked.`);
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Single Reject
  const handleReject = (requestId: string) => {
    const req = outingRequests.find((r) => r.id === requestId);
    if (!req) return;
    setOutingRequests((prev) =>
      prev.map((item) =>
        item.id === requestId
          ? {
              ...item,
              status: 'Rejected',
              decisionTimestamp: `Rejected by Chief Warden Desk`,
            }
          : item
      )
    );
    setStatusMessage(`Outing request for ${req.studentName} (${req.studentRegNo}) marked Rejected.`);
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Batch Approve All Verified
  const handleBatchApproveVerified = () => {
    const pendingVerified = outingRequests.filter(
      (r) => r.status === 'Pending Review' && r.parentConsentVerified && r.mentorApproved
    );
    if (pendingVerified.length === 0) {
      setStatusMessage('No pending parent-verified requests to batch approve.');
      setTimeout(() => setStatusMessage(null), 4000);
      return;
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOutingRequests((prev) =>
      prev.map((item) =>
        item.status === 'Pending Review' && item.parentConsentVerified && item.mentorApproved
          ? {
              ...item,
              status: 'Approved',
              decisionTimestamp: `Batch approved at ${now} by Registrar Desk`,
            }
          : item
      )
    );
    setStatusMessage(
      `Successfully batch-approved ${pendingVerified.length} parent-verified outing requests. Biometric turnstile whitelist updated.`
    );
    setTimeout(() => setStatusMessage(null), 6000);
  };

  // Publish Emergency Circular
  const handlePublishCircular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const created: EmergencyCircular = {
      id: `circ-${Date.now()}`,
      title: newTitle.trim(),
      summary: newSummary.trim(),
      content: newSummary.trim(),
      targetAudience: newAudience,
      priority: newPriority,
      publishedAt: 'Just now',
      publishedBy: 'Dr. S. K. Narayanan (Registrar)',
      isActive: true,
      acknowledgedCount: 0,
    };

    setCirculars((prev) => [created, ...prev]);
    setIsPublishingNew(false);
    setNewTitle('');
    setNewSummary('');
    setStatusMessage(`Dispatched high-priority circular: "${created.title}" to ${created.targetAudience}.`);
    setTimeout(() => setStatusMessage(null), 6000);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Live Accessibility Status Announcer */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {statusMessage || ''}
      </div>

      {/* 1. Institutional Health & Governance Banner */}
      <section
        aria-label="Institutional Operations Summary"
        className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 shadow-sm border border-indigo-500/30 relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/40">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" aria-hidden="true" />
                Institutional Operations Cockpit
              </span>
              <span className="text-xs font-mono text-purple-300 font-semibold">
                Central Registrar Desk • ADM1001
              </span>
              <span className="text-xs text-slate-300">
                Live Biometric Telemetry & Clearance System
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Dr. S. K. Narayanan • Chief Administrative Officer & Registrar
              </h2>
              <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-0.5">
                <span>Active Term: Fall Semester 2026-27</span>
                <span className="text-indigo-400">•</span>
                <span>Security Perimeter: Active</span>
                <span className="text-indigo-400">•</span>
                <span className="text-emerald-400 font-semibold">14 Biometric Gates Synchronized</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleBatchApproveVerified}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400"
            >
              <CheckCheck className="w-4 h-4 text-white" aria-hidden="true" />
              <span>Batch Approve Verified Outings</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPublishingNew(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Radio className="w-3.5 h-3.5 text-purple-300" aria-hidden="true" />
              <span>Broadcast Circular</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Campus Real-Time Health Metrics Bar (4 Operational Cockpit Tiles) */}
      <section aria-label="Real-time campus operational metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Campus Headcount */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[108px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Campus Headcount
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {MOCK_ADMIN_KPIS.studentsOnCampus.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                / {MOCK_ADMIN_KPIS.campusHeadcountTotal.toLocaleString()}
              </span>
            </div>
            <div className="text-[11px] text-indigo-700 font-bold mt-0.5">
              {MOCK_ADMIN_KPIS.studentsOutOnPass} Students Out on Pass
            </div>
          </div>
        </div>

        {/* Pending Outing Requests */}
        <button
          type="button"
          onClick={() => onNavigateTo('adminouting')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 hover:border-amber-500 hover:shadow-xs active:scale-[0.98] transition-all text-left flex flex-col justify-between min-h-[108px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pending Outing Desk
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-black text-amber-800 tabular-nums">
              {MOCK_ADMIN_KPIS.pendingOutingReviews}
            </span>
            <span className="text-[11px] text-amber-700 font-bold ml-2">
              Awaiting Warden Action
            </span>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Click to open Full Outing Console
            </div>
          </div>
        </button>

        {/* Faculty On Duty Today */}
        <button
          type="button"
          onClick={() => onNavigateTo('adminacademics')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 hover:border-teal-600 hover:shadow-xs active:scale-[0.98] transition-all text-left flex flex-col justify-between min-h-[108px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Faculty on Duty
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {MOCK_ADMIN_KPIS.facultyPresentCount}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                / {MOCK_ADMIN_KPIS.facultyTotalCount}
              </span>
            </div>
            <div className="text-[11px] text-teal-700 font-bold mt-0.5">
              {MOCK_ADMIN_KPIS.facultyAttendanceRate}% Present Today
            </div>
          </div>
        </button>

        {/* Pending Fee & Hall Ticket Clearances */}
        <button
          type="button"
          onClick={() => onNavigateTo('adminfinance')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 hover:border-purple-600 hover:shadow-xs active:scale-[0.98] transition-all text-left flex flex-col justify-between min-h-[108px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Fee Clearances
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {MOCK_ADMIN_KPIS.pendingFeeClearances}
            </span>
            <span className="text-[11px] text-purple-700 font-bold ml-2">
              Hall Ticket Audits
            </span>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Click to open Finance Ledger
            </div>
          </div>
        </button>
      </section>

      {/* Global Status Banner Notification */}
      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>{statusMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            aria-label="Dismiss notification"
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/60 cursor-pointer active:scale-[0.95] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* 3. Operational Grid (Interactive Outing Queue + Biometric Gate Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column (8 cols): Hostel Outing Approval Desk (Interactive Queue) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Hostel Outing Approval Desk (Live Queue)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {outingRequests.filter((r) => r.status === 'Pending Review').length} Pending
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Single-click verification for weekend and general gate passes. Instant biometric synchronization.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleBatchApproveVerified}
                  className="px-3 py-2 min-h-[44px] rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <CheckCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Batch Approve Verified</span>
                </button>
              </div>
            </div>

            {/* Outing Requests Table */}
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th scope="col" className="py-2.5 px-3">Student & Room</th>
                    <th scope="col" className="py-2.5 px-3">Outing Details</th>
                    <th scope="col" className="py-2.5 px-3 text-center">Verifications</th>
                    <th scope="col" className="py-2.5 px-3 text-right">Warden Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outingRequests.map((req) => {
                    const isPending = req.status === 'Pending Review';
                    const isApproved = req.status === 'Approved';

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 align-top">
                          <div className="font-bold text-slate-900">{req.studentName}</div>
                          <div className="text-[11px] font-mono text-slate-600 font-semibold">
                            {req.studentRegNo}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {req.hostelBlock} • Rm {req.roomNo}
                          </div>
                        </td>

                        <td className="py-3 px-3 align-top max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                                req.outingType === 'Weekend Outing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : req.outingType === 'Emergency Outing'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-teal-100 text-teal-800'
                              }`}
                            >
                              {req.outingType}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-800 mt-1">
                            {req.placeOfVisit}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {req.fromDate} → {req.toDate}
                          </div>
                          <div className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">
                            Purpose: {req.purpose}
                          </div>
                        </td>

                        <td className="py-3 px-3 align-top text-center">
                          <div className="space-y-1 inline-flex flex-col items-center">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                req.parentConsentVerified
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {req.parentConsentVerified ? 'Parent: Verified' : 'Parent: Call Req'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Mentor: {req.mentorApproved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 align-top text-right">
                          {isPending ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleApprove(req.id)}
                                className="px-3 py-2 min-h-[40px] rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(req.id)}
                                className="px-3 py-2 min-h-[40px] rounded-lg bg-rose-50 hover:bg-rose-100 active:scale-[0.98] text-rose-800 border border-rose-200 font-bold text-xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="text-right">
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                                  isApproved
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {isApproved ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                                )}
                                {req.status}
                              </span>
                              {req.decisionTimestamp && (
                                <div className="text-[9px] text-slate-500 mt-1 font-mono">
                                  {req.decisionTimestamp}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Showing 5 active requests • Total 47 pending in university queue
              </span>
              <button
                type="button"
                onClick={() => onNavigateTo('adminouting')}
                className="text-xs font-bold text-[#176CB8] hover:text-[#114B80] hover:underline flex items-center gap-1 min-h-[44px] px-2 py-1 rounded-lg cursor-pointer active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
              >
                <span>Open Full Warden Queue</span>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Emergency Circular Publisher & Active Notices */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-600" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-900">
                  Campus Spotlight & Emergency Broadcast Publisher
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPublishingNew(!isPublishingNew)}
                className="px-3 py-2 min-h-[44px] rounded-lg bg-purple-50 hover:bg-purple-100 active:scale-[0.98] text-purple-800 border border-purple-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isPublishingNew ? 'Cancel Broadcast' : 'Draft New Broadcast'}</span>
              </button>
            </div>

            {/* Broadcast Form Drawer */}
            {isPublishingNew && (
              <form
                onSubmit={handlePublishCircular}
                className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-3 animate-in fade-in duration-150"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="circ-title"
                      className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
                    >
                      Broadcast Headline
                    </label>
                    <input
                      id="circ-title"
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Weather Advisory: Heavy Rains Expected"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        htmlFor="circ-target"
                        className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
                      >
                        Target Audience
                      </label>
                      <select
                        id="circ-target"
                        value={newAudience}
                        onChange={(e) =>
                          setNewAudience(
                            e.target.value as 'All University' | 'All Students' | 'All Faculty' | 'Hostellers Only'
                          )
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="All University">All University</option>
                        <option value="All Students">All Students</option>
                        <option value="Hostellers Only">Hostellers Only</option>
                        <option value="All Faculty">All Faculty</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="circ-priority"
                        className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
                      >
                        Priority Tier
                      </label>
                      <select
                        id="circ-priority"
                        value={newPriority}
                        onChange={(e) =>
                          setNewPriority(e.target.value as 'Emergency' | 'Urgent' | 'Info')
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-bold"
                      >
                        <option value="Urgent">Urgent Alert</option>
                        <option value="Emergency">Emergency (Push)</option>
                        <option value="Info">General Circular</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="circ-summary"
                    className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    Broadcast Summary & Action Instructions
                  </label>
                  <textarea
                    id="circ-summary"
                    rows={2}
                    required
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="Provide specific guidelines, curfew hours, or alternative arrangements..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2.5 min-h-[44px] rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-[0.98] text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
                  >
                    <Radio className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Publish Immediate Broadcast</span>
                  </button>
                </div>
              </form>
            )}

            {/* Active Published Circulars */}
            <div className="space-y-2.5">
              {circulars.map((circ) => (
                <div
                  key={circ.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          circ.priority === 'Emergency'
                            ? 'bg-rose-100 text-rose-800'
                            : circ.priority === 'Urgent'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {circ.priority}
                      </span>
                      <span className="font-bold text-slate-900">{circ.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Audience: {circ.targetAudience}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs line-clamp-1">{circ.summary}</p>
                    <div className="text-[10px] text-slate-500 tabular-nums">
                      Dispatched {circ.publishedAt} by {circ.publishedBy} • {circ.acknowledgedCount?.toLocaleString()} reads
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      Live on Portal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Security Operations & Biometric Gate Turnstile Stream */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-900">
                  Biometric Gate Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                Perimeter: Active
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Live turnstile verification stream from Main Gate, Hostel Block gates, and Library checkpoints.
            </p>

            <div className="space-y-2.5">
              {MOCK_ADMIN_GATE_LOGS.map((log) => {
                const isOut = log.direction === 'OUT';
                const isFlagged = log.status === 'Flagged';

                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      isFlagged
                        ? 'bg-rose-50/60 border-rose-200'
                        : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isOut
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {isOut ? (
                            <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                          ) : (
                            <ArrowDownLeft className="w-3 h-3" aria-hidden="true" />
                          )}
                          {log.direction}
                        </span>
                        <span className="font-mono font-bold text-slate-900">{log.timestamp}</span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isFlagged
                            ? 'bg-rose-600 text-white font-mono'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>

                    <div className="mt-1.5">
                      <div className="font-bold text-slate-900">{log.studentName}</div>
                      <div className="text-[11px] font-mono text-slate-600 font-semibold">
                        {log.studentRegNo} • {log.hostelBlock}
                      </div>
                    </div>

                    <div className="mt-1 text-[10px] text-slate-500 flex flex-col gap-0.5">
                      <span>Gate: <strong>{log.gate}</strong></span>
                      <span>Verified: {log.verifiedBy}</span>
                      {log.passId && (
                        <span className="font-mono text-slate-600">ID: {log.passId}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateTo('admingate')}
                className="w-full py-2.5 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
              >
                <span>View Full Turnstile Audit Log</span>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
