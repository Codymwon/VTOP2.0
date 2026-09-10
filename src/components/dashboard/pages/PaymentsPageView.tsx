import React, { useState, useEffect } from 'react';
import { PageBreadcrumbHeader } from './PageBreadcrumbHeader';
import {
  CheckCircle2,
  Download,
  ShieldCheck,
  Printer,
  X,
  FileCheck,
} from 'lucide-react';

interface PaymentsPageViewProps {
  onBackToDashboard: () => void;
}

interface FeeReceipt {
  id: string;
  receiptNo: string;
  description: string;
  semester: string;
  amount: string;
  paidDate: string;
  paymentMode: string;
  status: 'Confirmed & Paid';
  refNo: string;
  gstNo: string;
}

const MOCK_RECEIPTS: FeeReceipt[] = [
  {
    id: 'rcp-1',
    receiptNo: 'VITAP/2026-27/FEE/84102',
    description: 'Fall Semester 2026-27 Academic Tuition Fee',
    semester: 'Fall Semester 2026-27',
    amount: '₹ 95,000.00',
    paidDate: '15-Jul-2026',
    paymentMode: 'Net Banking (SBI e-Pay)',
    status: 'Confirmed & Paid',
    refNo: 'SBI-EPAY-9841209384',
    gstNo: '37AAAAA0000A1Z5',
  },
  {
    id: 'rcp-2',
    receiptNo: 'VITAP/2026-27/HST/33918',
    description: 'Hostel Accommodation & Special Mess Fee (MH-1 Room 705B)',
    semester: 'Academic Year 2026-27',
    amount: '₹ 1,15,000.00',
    paidDate: '18-Jul-2026',
    paymentMode: 'UPI / Razorpay Gateway',
    status: 'Confirmed & Paid',
    refNo: 'RZP-HST-2918401923',
    gstNo: '37AAAAA0000A1Z5',
  },
  {
    id: 'rcp-3',
    receiptNo: 'VITAP/2025-26/FEE/64019',
    description: 'Winter Semester 2025-26 Academic Tuition Fee',
    semester: 'Winter Semester 2025-26',
    amount: '₹ 95,000.00',
    paidDate: '05-Jan-2026',
    paymentMode: 'Net Banking (SBI e-Pay)',
    status: 'Confirmed & Paid',
    refNo: 'SBI-EPAY-7319482015',
    gstNo: '37AAAAA0000A1Z5',
  },
];

export const PaymentsPageView: React.FC<PaymentsPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<FeeReceipt | null>(null);

  // Escape key listener for the receipt voucher modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedReceipt) {
        setSelectedReceipt(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedReceipt]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Page Header */}
      <PageBreadcrumbHeader
        category="Finance & Accounts"
        title="Student Fee Payments & Receipts"
        subtitle="Review academic fee vouchers, download official tax receipts, and check transaction logs."
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            Zero Outstanding Dues
          </span>
        }
      />

      {/* Account Clearance Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Finance Clearance Status: All Paid
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tuition fee, laboratory charges, and hostel accommodation for Fall 2026-27 are fully verified.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block font-medium">Total Paid (AY 2026-27)</span>
          <strong className="text-xl font-mono font-black text-slate-900">
            ₹ 2,10,000.00
          </strong>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Official E-Receipts & Vouchers
          </h3>
          <span className="text-xs text-slate-500 font-mono font-medium">
            {MOCK_RECEIPTS.length} Recorded Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" aria-label="Official Fee Receipts and Vouchers">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                <th scope="col" className="py-3 px-4 min-w-[190px]">Receipt Number</th>
                <th scope="col" className="py-3 px-4 min-w-[240px]">Fee Description</th>
                <th scope="col" className="py-3 px-4 min-w-[130px]">Semester</th>
                <th scope="col" className="py-3 px-4 text-right min-w-[120px]">Amount</th>
                <th scope="col" className="py-3 px-4 min-w-[160px]">Date & Mode</th>
                <th scope="col" className="py-3 px-4 text-center min-w-[120px]">Status</th>
                <th scope="col" className="py-3 px-4 text-right min-w-[120px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_RECEIPTS.map((r, idx) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {r.receiptNo}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {r.description}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {r.semester}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    {r.amount}
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <div className="font-mono font-medium text-slate-700">{r.paidDate}</div>
                    <div className="text-[10px] text-slate-500">{r.paymentMode}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                      Paid
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(r)}
                      aria-label={`View and download signed PDF voucher for receipt ${r.receiptNo}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-[#176CB8] bg-blue-50/80 hover:bg-blue-100 border border-blue-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>PDF Voucher</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Signed E-Receipt Voucher Modal */}
      {selectedReceipt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="receipt-voucher-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Voucher Header */}
            <div className="bg-[#2455A3] text-white p-4 sm:p-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-80 block">
                  VIT-AP UNIVERSITY · FINANCE & ACCOUNTS SECTION
                </span>
                <h3 id="receipt-voucher-title" className="text-base font-black tracking-tight mt-0.5">
                  OFFICIAL TAX INVOICE & FEE RECEIPT
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                aria-label="Close receipt voucher"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Voucher Content */}
            <div className="p-5 space-y-4 text-xs">
              {/* Receipt Meta Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Receipt Number</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{selectedReceipt.receiptNo}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Payment Date</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReceipt.paidDate}</span>
                </div>
              </div>

              {/* Student & Program Record */}
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-900">Arjun K Sharma</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Register Number:</span>
                  <strong className="text-slate-900">23BCE1088</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Academic Program:</span>
                  <span className="text-slate-800">B.Tech Computer Science & Engineering (SCOPE)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Semester Period:</span>
                  <span className="text-slate-800">{selectedReceipt.semester}</span>
                </div>
              </div>

              {/* Transaction & GST Details */}
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee Description:</span>
                  <span className="text-slate-900 font-medium">{selectedReceipt.description}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Payment Gateway Ref:</span>
                  <span className="text-slate-700">{selectedReceipt.refNo}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Mode of Transfer:</span>
                  <span className="text-slate-700">{selectedReceipt.paymentMode}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">University GSTIN:</span>
                  <span className="text-slate-700">{selectedReceipt.gstNo}</span>
                </div>
              </div>

              {/* Total Paid Highlight */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  <div>
                    <span className="text-[11px] font-bold text-emerald-900 block">Total Amount Received</span>
                    <span className="text-[10px] text-emerald-700">Payment Status: Confirmed & Reconciled</span>
                  </div>
                </div>
                <span className="text-lg font-mono font-black text-emerald-900">
                  {selectedReceipt.amount}
                </span>
              </div>

              {/* Digital Authentication Note */}
              <div className="text-[10px] text-slate-500 text-center pt-1">
                This is an authenticated computer-generated e-voucher from VTOP 2.0. No physical signature is required.
              </div>
            </div>

            {/* Voucher Actions Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
              >
                Close Voucher
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
