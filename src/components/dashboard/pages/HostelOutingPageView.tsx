import React, { useState } from 'react';
import { PageBreadcrumbHeader } from './PageBreadcrumbHeader';
import { OutingRecord } from '../../../types/dashboard';
import {
  MOCK_OUTING_RECORDS,
  MOCK_STUDENT_PROFILE,
} from '../../../services/mockDashboardService';
import {
  Building2,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
  QrCode,
  Send,
  PlusCircle,
  History,
  X,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Bed,
  Utensils,
  Wrench,
  Download,
  PhoneCall,
} from 'lucide-react';

interface HostelOutingPageViewProps {
  onBackToDashboard: () => void;
  initialTab?: 'history' | 'apply' | 'room';
}

export const HostelOutingPageView: React.FC<HostelOutingPageViewProps> = ({
  onBackToDashboard,
  initialTab = 'history',
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'apply' | 'room'>(initialTab);

  // Sync activeTab if initialTab changes via sidebar navigation
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [outings, setOutings] = useState<OutingRecord[]>(MOCK_OUTING_RECORDS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'accepted' | 'rejected'>('all');

  // Policy banner toggle
  const [showPolicy, setShowPolicy] = useState(true);

  // Apply Form State
  const [outingType, setOutingType] = useState<'weekend' | 'general'>('weekend');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [fromDate, setFromDate] = useState('2026-09-19');
  const [fromTime, setFromTime] = useState('04:00 PM');
  const [toDate, setToDate] = useState('2026-09-21');
  const [toTime, setToTime] = useState('08:00 PM');
  const parentContact = '+91 98765 43210';
  const [hasParentConsent, setHasParentConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Digital Outpass Modal State
  const [activeOutpass, setActiveOutpass] = useState<OutingRecord | null>(null);

  // Maintenance Tickets State for Tab 3
  const [maintenanceTickets, setMaintenanceTickets] = useState([
    {
      id: 'T-8092',
      title: 'AC Filter Cleaning & Thermostat Check',
      category: 'AC & Ventilation',
      date: '10-Sep-2026',
      status: 'Resolved',
    },
    {
      id: 'T-8140',
      title: 'Balcony Door Latch Inspection',
      category: 'Carpentry',
      date: '12-Sep-2026',
      status: 'In Progress',
    },
  ]);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [ticketCategory, setTicketCategory] = useState('Electrical');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDesc.trim()) return;
    const newTicket = {
      id: `T-${Math.floor(8200 + Math.random() * 100)}`,
      title: ticketDesc.trim(),
      category: ticketCategory,
      date: '12-Sep-2026',
      status: 'In Progress',
    };
    setMaintenanceTickets([newTicket, ...maintenanceTickets]);
    setTicketSuccess(true);
    setTimeout(() => {
      setTicketSuccess(false);
      setIsMaintenanceModalOpen(false);
      setTicketDesc('');
    }, 1200);
  };

  // Close modals on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeOutpass) setActiveOutpass(null);
        if (isMaintenanceModalOpen) setIsMaintenanceModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeOutpass, isMaintenanceModalOpen]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !purpose || !fromDate || !toDate || !hasParentConsent) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newRecord: OutingRecord = {
        id: `out-${Date.now()}`,
        placeOfVisit: destination,
        purpose,
        fromDate,
        fromTime,
        toDate,
        toTime,
        status: 'Pending Mentor Approval',
        outPassAvailable: false,
        outingType,
        mentorRemark: 'Awaiting faculty proctor review by Dr. Hussain Syed.',
      };
      setOutings([newRecord, ...outings]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveTab('history');
      }, 1500);
    }, 900);
  };

  const filteredOutings = outings.filter((item) => {
    if (statusFilter === 'accepted') return item.status === 'Leave Request Accepted';
    if (statusFilter === 'rejected') return item.status === 'Mentor Rejected Request';
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Page Header */}
      <PageBreadcrumbHeader
        category="Campus & Hostel"
        title="Hostel Leave & Outing Pass"
        subtitle="Apply for weekend outing or general vacation leave, track mentor approval remarks, and generate biometric gate outpasses."
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-blue-50 text-[#176CB8] border border-blue-200 px-3 py-1.5 rounded-xl">
              Hostel: {MOCK_STUDENT_PROFILE.hostelBlock} · Room {MOCK_STUDENT_PROFILE.roomNo}
            </span>
          </div>
        }
      />

      {/* Navigation Sub-tabs */}
      <div
        className="bg-white border border-slate-200/80 rounded-2xl p-1.5 flex flex-wrap gap-1 shadow-xs"
        role="tablist"
        aria-label="Hostel Leave Sections"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#183668] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" aria-hidden="true" />
          <span>Outing History & Passes ({outings.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'apply'}
          onClick={() => setActiveTab('apply')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
            activeTab === 'apply'
              ? 'bg-[#183668] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
          <span>Apply New Outing Request</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'room'}
          onClick={() => setActiveTab('room')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
            activeTab === 'room'
              ? 'bg-[#183668] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" aria-hidden="true" />
          <span>Room & Hostel Details</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OUTING HISTORY & ACTIVE PASSES                                     */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {/* Active Approved Outing Hero Card - Shown ONLY on the History Tab */}
          <div className="bg-linear-to-r from-emerald-50 via-teal-50/40 to-white border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                  Active Approved Gate Pass
                </span>
                <span className="text-xs text-slate-500 font-semibold">Weekend Outing</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Vijayawada City (Weekend personal outing & shopping)
              </h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-700 font-sans tabular-nums pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                  Out: <strong>12-Sep-2026 04:00 PM</strong>
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                  In: <strong>14-Sep-2026 08:00 PM</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveOutpass(outings[outings.length - 1])}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-700/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer"
              >
                <QrCode className="w-4 h-4" aria-hidden="true" />
                <span>View Digital Outpass</span>
              </button>
            </div>
          </div>

          {/* History Records Table Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            {/* Table Filter Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Filter Records:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                      statusFilter === 'all'
                        ? 'bg-[#183668] text-white'
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    All ({outings.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('accepted')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                      statusFilter === 'accepted'
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    Accepted ({outings.filter((o) => o.status === 'Leave Request Accepted').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('rejected')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                      statusFilter === 'rejected'
                        ? 'bg-rose-700 text-white'
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    Rejected ({outings.filter((o) => o.status === 'Mentor Rejected Request').length})
                  </button>
                </div>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Reviewing Proctor: <strong>Dr. Hussain Syed</strong> (SCOPE)
              </span>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table
                className="w-full text-left text-xs border-collapse"
                aria-label="Hostel Leave and Outing History Table"
              >
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th scope="col" className="py-3 px-3 w-10 text-center">#</th>
                    <th scope="col" className="py-3 px-4 min-w-[170px]">Place of Visit</th>
                    <th scope="col" className="py-3 px-4 min-w-[160px]">Purpose</th>
                    <th scope="col" className="py-3 px-4 min-w-[140px]">Out Date & Time</th>
                    <th scope="col" className="py-3 px-4 min-w-[140px]">In Date & Time</th>
                    <th scope="col" className="py-3 px-4 min-w-[200px]">Status & Mentor Remarks</th>
                    <th scope="col" className="py-3 px-4 text-right min-w-[110px]">Gate Pass</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOutings.map((record, idx) => (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 text-center text-slate-400 font-medium tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                          <span>{record.placeOfVisit}</span>
                        </div>
                        {record.outingType && (
                          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider pl-5 mt-0.5">
                            {record.outingType}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {record.purpose}
                      </td>
                      <td className="py-3.5 px-4 font-sans tabular-nums text-slate-800">
                        <div className="font-semibold">{record.fromDate}</div>
                        <div className="text-[11px] text-slate-500">{record.fromTime}</div>
                      </td>
                      <td className="py-3.5 px-4 font-sans tabular-nums text-slate-800">
                        <div className="font-semibold">{record.toDate}</div>
                        <div className="text-[11px] text-slate-500">{record.toTime}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {record.status === 'Leave Request Accepted' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                              Accepted
                            </span>
                            {record.mentorRemark && (
                              <div className="text-[11px] text-slate-600 leading-tight">
                                {record.mentorRemark}
                              </div>
                            )}
                          </div>
                        ) : record.status === 'Mentor Rejected Request' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-600" aria-hidden="true" />
                              Mentor Rejected
                            </span>
                            {record.mentorRemark && (
                              <div className="text-[11px] text-rose-700 bg-rose-50/50 p-1.5 rounded-md border border-rose-100 font-medium leading-tight">
                                <strong>Remark:</strong> {record.mentorRemark}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              <AlertCircle className="w-3 h-3 text-amber-600" aria-hidden="true" />
                              Pending Mentor
                            </span>
                            <div className="text-[11px] text-slate-500">
                              Routed to Dr. Hussain Syed
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {record.outPassAvailable ? (
                          <button
                            type="button"
                            onClick={() => setActiveOutpass(record)}
                            aria-label={`View digital outpass for ${record.placeOfVisit}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-bold text-[#176CB8] bg-blue-50/80 hover:bg-blue-100 border border-blue-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Outpass</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs font-mono">-</span>
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

      {/* ========================================================================= */}
      {/* TAB 2: APPLY OUTING FORM                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'apply' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Application Form (8 cols on lg) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4 mb-5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Hostel Leave & Outing Application
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submit your travel itinerary for mentor approval. Automatic SMS confirmation is sent to your registered parent contact.
                </p>
              </div>

              {/* Reviewing Authority Tag */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <UserCheck className="w-3.5 h-3.5 text-[#176CB8]" aria-hidden="true" />
                <span>Mentor: <strong>Dr. Hussain Syed</strong></span>
              </div>
            </div>

            {submitSuccess ? (
              <div className="py-10 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <h4 className="text-base font-bold text-emerald-900">
                  Outing Request Dispatched Successfully!
                </h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Your leave itinerary has been routed to your Faculty Mentor (Dr. Hussain Syed) for digital authorization. SMS notification was triggered to {parentContact}.
                </p>
                <div className="text-xs text-slate-500 font-semibold pt-1">
                  Redirecting to your Outing History...
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                {/* Outing Type Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Outing Type *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOutingType('weekend')}
                      className={`p-3 min-h-[44px] rounded-xl border text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
                        outingType === 'weekend'
                          ? 'border-[#176CB8] bg-blue-50/50 ring-2 ring-[#176CB8]'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="block text-xs font-bold text-slate-900">Weekend Outing</span>
                        {outingType === 'weekend' && (
                          <span className="w-2 h-2 rounded-full bg-[#176CB8]" />
                        )}
                      </div>
                      <span className="block text-[11px] text-slate-500 mt-1">
                        Local Vijayawada/Guntur city visits (Fri 04:00 PM to Sun 08:00 PM)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOutingType('general')}
                      className={`p-3 min-h-[44px] rounded-xl border text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer ${
                        outingType === 'general'
                          ? 'border-[#176CB8] bg-blue-50/50 ring-2 ring-[#176CB8]'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="block text-xs font-bold text-slate-900">General Leave</span>
                        {outingType === 'general' && (
                          <span className="w-2 h-2 rounded-full bg-[#176CB8]" />
                        )}
                      </div>
                      <span className="block text-[11px] text-slate-500 mt-1">
                        Hometown vacation or multi-day university sanctioned leave
                      </span>
                    </button>
                  </div>
                </div>

                {/* Place of Visit & Purpose */}
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="outing-place-of-visit"
                      className="block text-xs font-bold text-slate-700 mb-1"
                    >
                      Place of Visit / City & Destination *
                    </label>
                    <input
                      id="outing-place-of-visit"
                      type="text"
                      required
                      placeholder="e.g. Hyderabad / Visakhapatnam / Vijayawada City Center"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3.5 py-2.5 min-h-[44px] text-xs bg-slate-50/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="outing-purpose"
                      className="block text-xs font-bold text-slate-700 mb-1"
                    >
                      Detailed Purpose & Travel Itinerary *
                    </label>
                    <textarea
                      id="outing-purpose"
                      required
                      rows={2}
                      placeholder="e.g. Attending family function and scheduled medical consultation at hometown."
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-3.5 py-2.5 min-h-[44px] text-xs bg-slate-50/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* Date & Time Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Departure */}
                  <div className="space-y-1.5">
                    <label htmlFor="outing-from-date" className="block text-xs font-bold text-slate-700">
                      Departure Date & Time *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        id="outing-from-date"
                        type="date"
                        required
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full px-3 py-2.5 min-h-[44px] text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-900 font-sans tabular-nums"
                      />
                      <select
                        value={fromTime}
                        onChange={(e) => setFromTime(e.target.value)}
                        aria-label="Departure slot"
                        className="w-full px-3 py-2.5 min-h-[44px] text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-900 font-sans tabular-nums"
                      >
                        <option value="04:00 PM">04:00 PM (Friday Standard)</option>
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="07:00 PM">07:00 PM</option>
                        <option value="08:00 AM">08:00 AM (Saturday)</option>
                        <option value="10:00 AM">10:00 AM (Saturday)</option>
                      </select>
                    </div>
                  </div>

                  {/* Return */}
                  <div className="space-y-1.5">
                    <label htmlFor="outing-to-date" className="block text-xs font-bold text-slate-700">
                      Expected Return Date & Time *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        id="outing-to-date"
                        type="date"
                        required
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full px-3 py-2.5 min-h-[44px] text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-900 font-sans tabular-nums"
                      />
                      <select
                        value={toTime}
                        onChange={(e) => setToTime(e.target.value)}
                        aria-label="Return curfew slot"
                        className="w-full px-3 py-2.5 min-h-[44px] text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-900 font-sans tabular-nums"
                      >
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="07:00 PM">07:00 PM</option>
                        <option value="08:00 PM">08:00 PM (Hostel Curfew)</option>
                        <option value="08:30 PM">08:30 PM (Sunday Grace)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Parent Contact Verification */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="outing-parent-contact" className="text-xs font-bold text-slate-700">
                      Registered Parent / Guardian Phone Number
                    </label>
                    <span className="text-[11px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      Verified Mobile
                    </span>
                  </div>
                  <input
                    id="outing-parent-contact"
                    type="text"
                    disabled
                    value={parentContact}
                    className="w-full max-w-xs px-3.5 py-2 min-h-[40px] text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-sans tabular-nums font-semibold"
                  />
                  <p className="text-[11px] text-slate-500 pt-0.5">
                    To modify guardian phone records, please submit an application at the Student Welfare Office (Admin Block).
                  </p>
                </div>

                {/* Undertaking Checkbox */}
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={hasParentConsent}
                    onChange={(e) => setHasParentConsent(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded text-[#176CB8] focus:ring-[#176CB8] cursor-pointer"
                  />
                  <span className="leading-relaxed">
                    I confirm that I have informed my parents regarding this travel itinerary, and I undertake to adhere to the hostel biometric checkout & in-punch timings at the Main Campus Turnstile.
                  </span>
                </label>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isSubmitting ? 'Routing to Mentor...' : 'Submit Outing Application'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Hostel Guidelines & Curfew Card (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
                  <span>Hostel Outing Policy & Timings</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPolicy(!showPolicy)}
                  aria-label="Toggle policy details"
                  className="text-slate-400 hover:text-slate-700 text-xs p-1 cursor-pointer"
                >
                  {showPolicy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showPolicy && (
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <div className="space-y-1">
                    <strong className="text-slate-900 block font-bold">1. Curfew & Gate In-Punch</strong>
                    <p className="text-[11px] text-slate-600">
                      All students must punch in at the Main Campus Turnstile by <strong>08:00 PM</strong> on weekdays and <strong>08:30 PM</strong> on Sundays.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-slate-900 block font-bold">2. Biometric Verification</strong>
                    <p className="text-[11px] text-slate-600">
                      Dual biometric scan is mandatory: first at the Security Main Gate, followed by your respective Hostel Block entry turnstile.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-slate-900 block font-bold">3. Minimum Academic Attendance</strong>
                    <p className="text-[11px] text-slate-600">
                      Outing requests are automatically blocked if academic attendance falls below 75% in any registered course.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold mb-0.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
                      <span>Late Entry Penalty</span>
                    </div>
                    Late punch without warden prior permission results in immediate parent intimation and a 2-week outing suspension.
                  </div>
                </div>
              )}
            </div>

            {/* Quick Contact Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
                <span>Hostel Warden Desk</span>
              </div>
              <div className="text-slate-600 text-[11px] space-y-0.5">
                <div>Prof. K. Ramesh (Chief Warden)</div>
                <div>Ext: <strong>#2041</strong> · Office MH-1 Ground Floor</div>
                <div>Emergency Ambulance: <strong>+91 863 234 1008</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HOSTEL ROOM & RESIDENCE COCKPIT                                    */}
      {/* Full-width responsive 2-column layout (7 cols / 5 cols)                   */}
      {/* ========================================================================= */}
      {activeTab === 'room' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Accommodation, Roommates & Maintenance (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Primary Room Allocation Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
                    <span>Hostel Accommodation & Room Allocation</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official residential record for Academic Year 2026-27.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                  Occupancy Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 font-medium block text-[11px]">Hostel Block & Floor</span>
                  <strong className="text-sm text-slate-900 block font-bold">
                    {MOCK_STUDENT_PROFILE.hostelBlock} (Men's Hostel 1 · Block A, Floor 7)
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-200/70 space-y-1">
                  <span className="text-slate-500 font-medium block text-[11px]">Allocated Room Number</span>
                  <strong className="text-sm text-[#176CB8] block font-sans tabular-nums font-bold">
                    {MOCK_STUDENT_PROFILE.roomNo} (AC 2-Bedded Deluxe)
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 font-medium block text-[11px]">Mess Subscription</span>
                  <strong className="text-sm text-slate-900 block font-bold">
                    Special South & North Catered Mess
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 font-medium block text-[11px]">Biometric Gate Status</span>
                  <strong className="text-sm text-emerald-700 block font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    Turnstiles 1 & 2 Cleared
                  </strong>
                </div>
              </div>
            </div>

            {/* 2. Roommates & Bed Allocation Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
                  <h4 className="text-sm font-bold text-slate-900">Roommates & Bed Assignment</h4>
                </div>
                <span className="text-xs text-slate-500 font-sans tabular-nums font-medium">
                  2 of 2 Beds Occupied
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Bed A (Student) */}
                <div className="p-3.5 rounded-xl border-2 border-[#176CB8]/30 bg-[#183668]/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#176CB8] bg-white px-2 py-0.5 rounded border border-[#176CB8]/30 uppercase tracking-wider">
                      Bed A (Window Side)
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">You</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{MOCK_STUDENT_PROFILE.name}</div>
                    <div className="text-[11px] text-slate-500 font-sans tabular-nums font-medium">
                      {MOCK_STUDENT_PROFILE.regNo} · {MOCK_STUDENT_PROFILE.program}
                    </div>
                  </div>
                </div>

                {/* Bed B (Roommate) */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
                      Bed B (Door Side)
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Resident</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Rohan Varma</div>
                    <div className="text-[11px] text-slate-500 font-sans tabular-nums font-medium">
                      23BCE1042 · B.Tech CSE (Core)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Hostel Maintenance & Complaint Tickets */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
                  <h4 className="text-sm font-bold text-slate-900">Hostel Maintenance & Repair Tickets</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMaintenanceModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
                >
                  <span>+ Lodge Complaint</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {maintenanceTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-sans tabular-nums font-bold text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded">
                          {ticket.id}
                        </span>
                        <span className="font-bold text-slate-900 truncate">{ticket.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-sans tabular-nums">
                        Category: {ticket.category} · Logged: {ticket.date}
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        ticket.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Dining Schedule, Resident Care & Fees (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Dining & Mess Schedule */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
                  <h4 className="text-sm font-bold text-slate-900">Today's Dining Schedule</h4>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  Mess Hall 1
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Breakfast */}
                <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-slate-500">
                  <div>
                    <span className="font-semibold block text-slate-700">Breakfast</span>
                    <span className="text-[11px] font-sans tabular-nums">07:30 AM - 09:00 AM</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Completed
                  </span>
                </div>

                {/* Lunch */}
                <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-slate-500">
                  <div>
                    <span className="font-semibold block text-slate-700">Lunch</span>
                    <span className="text-[11px] font-sans tabular-nums">12:30 PM - 02:00 PM</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Completed
                  </span>
                </div>

                {/* Evening Snacks */}
                <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-900 block">Evening Snacks</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="text-[11px] font-sans tabular-nums text-emerald-800">
                      05:00 PM - 06:00 PM · Samosa, Tea & Coffee
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                {/* Dinner */}
                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold block text-slate-900">Dinner</span>
                    <span className="text-[11px] font-sans tabular-nums text-slate-600">
                      07:30 PM - 09:15 PM · Malabar Parotta, Paneer & Biryani
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    Upcoming
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Resident Care & Emergency Desk */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
                <h4 className="text-sm font-bold text-slate-900">Resident Care & Emergency Contacts</h4>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="font-medium">Chief Warden (Prof. K. Ramesh)</span>
                  <strong className="text-slate-900 font-sans tabular-nums">Ext: #2041</strong>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="font-medium">Resident Warden (Dr. C. Mohan)</span>
                  <strong className="text-slate-900 font-sans tabular-nums">+91 94451 88201</strong>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/60 border border-rose-100 text-rose-900">
                  <span className="font-bold">24x7 Night Emergency Ambulance</span>
                  <strong className="font-sans tabular-nums font-black">+91 863 234 1008</strong>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="font-medium">Laundry Facility Slot</span>
                  <strong className="text-slate-900 font-sans tabular-nums">Saturday 09:00 AM</strong>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="font-medium">Wi-Fi Network</span>
                  <strong className="text-[#176CB8] font-sans">VIT-AP-RESIDENCE</strong>
                </div>
              </div>
            </div>

            {/* 3. Hostel Fee & Caution Deposit */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Hostel Dues & Caution Deposit</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  Paid in Full
                </span>
              </div>
              <div className="space-y-1 text-slate-600 font-sans tabular-nums">
                <div className="flex justify-between">
                  <span>AY 2026-27 Room & Mess:</span>
                  <strong className="text-slate-900">₹1,45,000</strong>
                </div>
                <div className="flex justify-between">
                  <span>Hostel Caution Deposit (Refundable):</span>
                  <strong className="text-slate-900">₹15,000</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Downloading official Hostel Fee Receipt for AY 2026-27 (PDF)...')}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 min-h-[38px] rounded-xl text-xs font-bold text-[#176CB8] bg-white hover:bg-blue-50/80 border border-blue-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Download Hostel Fee Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIGITAL SECURITY OUTPASS MODAL                                            */}
      {/* ========================================================================= */}
      {activeOutpass && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="outpass-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Outpass Header */}
            <div className="bg-gradient-to-r from-[#183668] via-[#2455A3] to-[#183668] text-white p-4 sm:p-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-85">
                  VIT-AP UNIVERSITY HOSTELS
                </span>
                <h3 id="outpass-modal-title" className="text-base font-black tracking-tight">
                  DIGITAL SECURITY GATE OUTPASS
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveOutpass(null)}
                aria-label="Close digital outpass"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Outpass Content */}
            <div className="p-5 space-y-4 text-xs">
              {/* Student Identification Banner */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-[#176CB8] text-white flex items-center justify-center font-bold text-base">
                  {MOCK_STUDENT_PROFILE.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {MOCK_STUDENT_PROFILE.name}
                  </h4>
                  <div className="font-sans tabular-nums text-slate-600 font-bold text-xs">
                    {MOCK_STUDENT_PROFILE.regNo} · {MOCK_STUDENT_PROFILE.hostelBlock}-{MOCK_STUDENT_PROFILE.roomNo}
                  </div>
                </div>
              </div>

              {/* QR Code and Barcode Placeholder */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2">
                <div className="w-28 h-28 bg-white border border-slate-300 rounded-xl mx-auto flex items-center justify-center p-2 shadow-2xs">
                  <QrCode className="w-24 h-24 text-slate-800" aria-hidden="true" />
                </div>
                <div className="font-sans tabular-nums text-[11px] font-bold text-slate-700 tracking-wider">
                  PASS-ID: {activeOutpass.id.toUpperCase()}
                </div>
                <div className="text-[10px] text-slate-500">
                  Scan at Main Campus Security Gate & Hostel Turnstile
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <strong className="text-slate-900">{activeOutpass.placeOfVisit}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Purpose:</span>
                  <span className="text-slate-800">{activeOutpass.purpose}</span>
                </div>
                <div className="flex justify-between font-sans tabular-nums">
                  <span className="text-slate-500">Out Punch Window:</span>
                  <strong className="text-emerald-700">{activeOutpass.fromDate} ({activeOutpass.fromTime})</strong>
                </div>
                <div className="flex justify-between font-sans tabular-nums">
                  <span className="text-slate-500">In Punch Curfew:</span>
                  <strong className="text-emerald-700">{activeOutpass.toDate} ({activeOutpass.toTime})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mentor Authorization:</span>
                  <span className="text-emerald-700 font-bold">Approved & Digitally Signed</span>
                </div>
              </div>
            </div>

            {/* Outpass Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-medium">Valid with Student ID Card</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Print Outpass</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAINTENANCE COMPLAINT MODAL                                               */}
      {/* ========================================================================= */}
      {isMaintenanceModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="maintenance-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-[#183668] via-[#2455A3] to-[#183668] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4" aria-hidden="true" />
                <h3 id="maintenance-modal-title" className="text-sm font-bold">
                  Lodge Hostel Maintenance Request
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMaintenanceModalOpen(false)}
                aria-label="Close maintenance modal"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {ticketSuccess ? (
              <div className="p-8 text-center space-y-2 bg-emerald-50 text-emerald-900 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Complaint Registered!</h4>
                <p className="text-xs text-emerald-700">
                  Ticket logged for Room 705B. Hostel technician assigned.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMaintenanceSubmit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Information</label>
                  <input
                    type="text"
                    disabled
                    value="MH-1 (Men's Hostel 1) · Room 705B"
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-semibold font-sans tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Category *</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
                  >
                    <option value="Electrical">Electrical (Lights, Fan, Switchboard)</option>
                    <option value="AC & Ventilation">AC & Cooling Unit</option>
                    <option value="Plumbing">Plumbing (Washroom, Tap, Shower)</option>
                    <option value="Carpentry">Carpentry (Cupboard, Door, Study Desk)</option>
                    <option value="Wi-Fi / Network">Wi-Fi & LAN Port</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description of the Issue *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Study table tube light flickering / AC remote display not responding."
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#176CB8]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMaintenanceModalOpen(false)}
                    className="px-4 py-2 min-h-[38px] rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 min-h-[38px] rounded-xl text-white bg-[#176CB8] hover:bg-[#135796] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
