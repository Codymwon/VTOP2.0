import React, { useState } from 'react';
import { PageBreadcrumbHeader } from '../PageBreadcrumbHeader';
import { MOCK_ADMIN_OUTING_REQUESTS } from '../../../../services/mockAdminService';
import { AdminOutingRequest } from '../../../../types/admin';
import {
  CheckCheck,
  CheckCircle2,
  XCircle,
  Search,
  X,
} from 'lucide-react';

interface AdminOutingDeskPageViewProps {
  onBackToDashboard: () => void;
}

export const AdminOutingDeskPageView: React.FC<AdminOutingDeskPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [requests, setRequests] = useState<AdminOutingRequest[]>(MOCK_ADMIN_OUTING_REQUESTS);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending Review' | 'Approved' | 'Rejected'>('ALL');
  const [blockFilter, setBlockFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailRequest, setActiveDetailRequest] = useState<AdminOutingRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'Approved', decisionTimestamp: `Approved today at ${now} by Registrar Desk` }
          : r
      )
    );
    const target = requests.find((r) => r.id === id);
    setToastMessage(`Approved outing pass for ${target?.studentName} (${target?.studentRegNo}).`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'Rejected', decisionTimestamp: `Rejected by Chief Warden Desk` } : r
      )
    );
    const target = requests.find((r) => r.id === id);
    setToastMessage(`Rejected outing pass for ${target?.studentName} (${target?.studentRegNo}).`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleBatchApproveVerified = () => {
    const pendingVerified = requests.filter(
      (r) => r.status === 'Pending Review' && r.parentConsentVerified && r.mentorApproved
    );
    if (pendingVerified.length === 0) {
      setToastMessage('No pending parent-verified requests to batch approve.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRequests((prev) =>
      prev.map((r) =>
        r.status === 'Pending Review' && r.parentConsentVerified && r.mentorApproved
          ? { ...r, status: 'Approved', decisionTimestamp: `Batch approved at ${now} by Registrar Desk` }
          : r
      )
    );
    setToastMessage(`Batch approved ${pendingVerified.length} parent-verified outing requests.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (blockFilter !== 'ALL' && !r.hostelBlock.includes(blockFilter)) return false;
    if (
      searchQuery &&
      !r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !r.studentRegNo.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !r.placeOfVisit.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageBreadcrumbHeader
        category="Hostel & Security Desk"
        title="Hostel Outing & Gate Pass Operations Console"
        subtitle="Central Warden Approval Desk, Parent Consent Audit, and Biometric Turnstile Clearance"
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <button
            type="button"
            onClick={handleBatchApproveVerified}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] transition-all shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <CheckCheck className="w-4 h-4" aria-hidden="true" />
            <span>Batch Approve Verified</span>
          </button>
        }
      />

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl flex-wrap">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                statusFilter === 'ALL' ? 'bg-white text-[#183668] shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              All Requests ({requests.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Pending Review')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                statusFilter === 'Pending Review'
                  ? 'bg-white text-[#183668] shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Pending ({requests.filter((r) => r.status === 'Pending Review').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Approved')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                statusFilter === 'Approved' ? 'bg-white text-[#183668] shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Approved ({requests.filter((r) => r.status === 'Approved').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Rejected')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                statusFilter === 'Rejected' ? 'bg-white text-[#183668] shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Rejected ({requests.filter((r) => r.status === 'Rejected').length})
            </button>
          </div>

          {/* Block Selector and Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              className="px-3 py-2 min-h-[44px] text-xs rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] font-bold"
            >
              <option value="ALL">All Hostel Blocks</option>
              <option value="Block 1">Men's Block 1</option>
              <option value="Block 2">Men's Block 2</option>
              <option value="Block 3">Men's Block 3</option>
              <option value="Block A">Ladies Block A</option>
              <option value="Block B">Ladies Block B</option>
            </select>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, reg no, city..."
                className="w-full pl-8 pr-3 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="py-2.5 px-3">Student & Residence</th>
                <th scope="col" className="py-2.5 px-3">Destination & Dates</th>
                <th scope="col" className="py-2.5 px-3">Purpose</th>
                <th scope="col" className="py-2.5 px-3 text-center">Verifications</th>
                <th scope="col" className="py-2.5 px-3 text-right">Warden Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => {
                const isPending = req.status === 'Pending Review';
                return (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => setActiveDetailRequest(req)}
                        className="text-left group"
                      >
                        <div className="font-bold text-slate-900 group-hover:text-[#176CB8] group-hover:underline">
                          {req.studentName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-600">{req.studentRegNo}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {req.hostelBlock} • Rm {req.roomNo}
                        </div>
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{req.placeOfVisit}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {req.fromDate} → {req.toDate}
                      </div>
                      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 mt-1">
                        {req.outingType}
                      </span>
                    </td>

                    <td className="py-3 px-3 max-w-xs text-slate-600 italic">
                      "{req.purpose}"
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="space-y-1 inline-flex flex-col items-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            req.parentConsentVerified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.parentConsentVerified ? 'Parent: Verified' : 'Parent: Call Needed'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Mentor: {req.mentorApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
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
                              req.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {req.status === 'Approved' ? (
                              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                            )}
                            {req.status}
                          </span>
                          {req.decisionTimestamp && (
                            <div className="text-[9px] text-slate-500 mt-0.5 font-mono">
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
      </div>

      {/* Outing Request Detail Modal */}
      {activeDetailRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            role="presentation"
            onClick={() => setActiveDetailRequest(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          <div
            role="dialog"
            aria-labelledby="outing-modal-title"
            aria-modal="true"
            className="relative z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 id="outing-modal-title" className="text-sm font-bold text-slate-900">
                  Outing Request Dossier: {activeDetailRequest.studentName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {activeDetailRequest.studentRegNo} • {activeDetailRequest.hostelBlock} (Rm {activeDetailRequest.roomNo})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetailRequest(null)}
                aria-label="Close dialog"
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="font-bold text-slate-800">Visit Destination & Purpose</div>
                <div className="text-slate-700 font-semibold">{activeDetailRequest.placeOfVisit}</div>
                <div className="text-slate-500 italic">"{activeDetailRequest.purpose}"</div>
                <div className="text-slate-600 mt-1">
                  Schedule: <strong>{activeDetailRequest.fromDate}</strong> to <strong>{activeDetailRequest.toDate}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="font-bold text-slate-800">Verification Trail</div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Parent Verification:</span>
                  <span className="font-semibold text-slate-900">
                    {activeDetailRequest.parentConsentVerified ? 'Verified via SMS' : 'Pending Voice Call'} ({activeDetailRequest.parentPhone})
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Faculty Mentor Approval:</span>
                  <span className="font-semibold text-slate-900">
                    {activeDetailRequest.mentorName}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveDetailRequest(null)}
                className="px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
              >
                Close
              </button>
              {activeDetailRequest.status === 'Pending Review' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleReject(activeDetailRequest.id);
                      setActiveDetailRequest(null);
                    }}
                    className="px-4 py-2 min-h-[44px] rounded-xl bg-rose-50 text-rose-800 border border-rose-200 font-bold text-xs hover:bg-rose-100 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                  >
                    Reject Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleApprove(activeDetailRequest.id);
                      setActiveDetailRequest(null);
                    }}
                    className="px-4 py-2 min-h-[44px] rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  >
                    Approve Outing Pass
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
