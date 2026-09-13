import React, { useState } from 'react';
import { PageBreadcrumbHeader } from '../PageBreadcrumbHeader';
import { MOCK_ADMIN_FEE_CLEARANCES } from '../../../../services/mockAdminService';
import { FeeClearanceAuditItem } from '../../../../types/admin';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Search,
  Download,
  ShieldCheck,
} from 'lucide-react';

interface AdminFinanceAuditPageViewProps {
  onBackToDashboard: () => void;
}

export const AdminFinanceAuditPageView: React.FC<AdminFinanceAuditPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [clearances, setClearances] = useState<FeeClearanceAuditItem[]>(MOCK_ADMIN_FEE_CLEARANCES);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Clear' | 'Pending Review' | 'Defaulter'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleGrantClearance = (id: string) => {
    setClearances((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              clearanceStatus: 'Clear',
              hallTicketEligible: true,
              balanceAmount: 0,
            }
          : item
      )
    );
    const target = clearances.find((c) => c.id === id);
    setToastMessage(`Granted exam hall ticket clearance for ${target?.studentName} (${target?.studentRegNo}).`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredItems = clearances.filter((item) => {
    if (statusFilter !== 'ALL' && item.clearanceStatus !== statusFilter) return false;
    if (
      searchQuery &&
      !item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.studentRegNo.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageBreadcrumbHeader
        category="Financial Governance"
        title="Institutional Fee & Hall Ticket Clearance Audit"
        subtitle="Term Fee Reconciliation, Defaulter Tracking, and Examination Hall Ticket Clearance Slips"
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <button
            type="button"
            onClick={() => alert('Downloading reconciliation ledger...')}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Export Reconciliation</span>
          </button>
        }
      />

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Fee Clearance Rate
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">98.2%</div>
            <div className="text-xs text-emerald-800 font-bold mt-0.5">8,240 Cleared Students</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Review
            </span>
            <div className="text-2xl font-black text-amber-800 mt-1 tabular-nums">18 Cases</div>
            <div className="text-xs text-amber-700 font-medium mt-0.5">Partial / Bank Verification</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <CreditCard className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Defaulter Flags
            </span>
            <div className="text-2xl font-black text-rose-800 mt-1 tabular-nums">6 Records</div>
            <div className="text-xs text-rose-700 font-medium mt-0.5">Hall Tickets Blocked</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                statusFilter === 'ALL' ? 'bg-white text-[#183668] shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              All Records ({clearances.length})
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
              Pending ({clearances.filter((c) => c.clearanceStatus === 'Pending Review').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Defaulter')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                statusFilter === 'Defaulter'
                  ? 'bg-white text-[#183668] shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Defaulters ({clearances.filter((c) => c.clearanceStatus === 'Defaulter').length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or reg no..."
              className="w-full pl-8 pr-3 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="py-2.5 px-3">Student Details</th>
                <th scope="col" className="py-2.5 px-3">Fee Category</th>
                <th scope="col" className="py-2.5 px-3 text-right">Total Due</th>
                <th scope="col" className="py-2.5 px-3 text-right">Balance Due</th>
                <th scope="col" className="py-2.5 px-3 text-center">Hall Ticket Status</th>
                <th scope="col" className="py-2.5 px-3 text-right">Clearance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{item.studentName}</div>
                    <div className="text-[11px] font-mono text-slate-600">{item.studentRegNo}</div>
                    <div className="text-[10px] text-slate-500">{item.program} • {item.semester}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800">{item.feeType}</span>
                    {item.paymentMode && (
                      <div className="text-[10px] text-slate-500 mt-0.5">Mode: {item.paymentMode}</div>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ₹{item.totalDue.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                    {item.balanceAmount > 0 ? (
                      <span className="text-rose-800">₹{item.balanceAmount.toLocaleString()}</span>
                    ) : (
                      <span className="text-emerald-800">₹0</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.hallTicketEligible
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.hallTicketEligible ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                          Eligible
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                          Blocked
                        </>
                      )}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    {!item.hallTicketEligible ? (
                      <button
                        type="button"
                        onClick={() => handleGrantClearance(item.id)}
                        className="px-3.5 py-2 min-h-[40px] rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                      >
                        Grant Clearance
                      </button>
                    ) : (
                      <span className="text-emerald-800 font-bold text-xs">Clear</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
