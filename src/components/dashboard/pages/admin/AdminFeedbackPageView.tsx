import React, { useState } from 'react';
import { PageBreadcrumbHeader } from '../PageBreadcrumbHeader';
import {
  Search,
  CheckCircle2,
  Star,
  Filter,
  Check,
  Edit3,
  X,
} from 'lucide-react';
import { PortalFeedbackItem, FeedbackStatus } from '../../../../types/feedback';
import { getPortalFeedback, updateFeedbackStatus } from '../../../../services/mockFeedbackService';

interface AdminFeedbackPageViewProps {
  onBackToDashboard: () => void;
}

export const AdminFeedbackPageView: React.FC<AdminFeedbackPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [feedbackList, setFeedbackList] = useState<PortalFeedbackItem[]>(() => getPortalFeedback());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Status editing modal / drawer state
  const [activeEditingItem, setActiveEditingItem] = useState<PortalFeedbackItem | null>(null);
  const [newStatus, setNewStatus] = useState<FeedbackStatus>('Under Review');
  const [adminNoteInput, setAdminNoteInput] = useState('');

  const filteredItems = feedbackList.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userRegNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetModule.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const totalCount = feedbackList.length;
  const newCount = feedbackList.filter((f) => f.status === 'New').length;
  const reviewCount = feedbackList.filter((f) => f.status === 'Under Review').length;
  const resolvedCount = feedbackList.filter((f) => f.status === 'Resolved').length;
  const bugCount = feedbackList.filter((f) => f.category === 'ui_bug').length;
  const avgRating = (
    feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / (totalCount || 1)
  ).toFixed(1);

  const handleOpenEdit = (item: PortalFeedbackItem) => {
    setActiveEditingItem(item);
    setNewStatus(item.status);
    setAdminNoteInput(item.adminNotes || '');
  };

  const handleSaveStatus = () => {
    if (!activeEditingItem) return;
    updateFeedbackStatus(activeEditingItem.id, newStatus, adminNoteInput);
    setFeedbackList(getPortalFeedback());
    setActiveEditingItem(null);
  };

  const getStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Planned':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <PageBreadcrumbHeader
        category="Institutional Registry & Governance"
        title="Portal UI Feedback & Usability Telemetry"
        subtitle="Review, triage, and resolve user-reported bugs, visual defects, and UX feature requests submitted across campus."
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl">
            {newCount} New Submissions
          </span>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Feedback</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-1">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">{newCount} awaiting triage</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active UI Bugs</div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono mt-1">
            {bugCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Reported defects</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Under Review / Planned</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono mt-1">
            {reviewCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">In engineering backlog</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Rating</div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
              {avgRating}
            </span>
            <span className="text-xs font-semibold text-slate-500 font-mono">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">{resolvedCount} resolved issues</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl flex-wrap">
            {['all', 'New', 'Under Review', 'Planned', 'Resolved'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? `All (${totalCount})` : st}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 pl-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#176CB8]"
            >
              <option value="all">All Categories</option>
              <option value="ui_bug">UI Bug</option>
              <option value="visual_glitch">Visual Glitch</option>
              <option value="feature_request">Feature Request</option>
              <option value="performance">Speed & Lag</option>
              <option value="usability">Usability / UX</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search feedback, user, module..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-900"
          />
        </div>
      </div>

      {/* Feedback Items Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                <th scope="col" className="py-3 px-4 min-w-[120px]">Ticket & User</th>
                <th scope="col" className="py-3 px-4 min-w-[140px]">Module & Category</th>
                <th scope="col" className="py-3 px-4 min-w-[280px]">Summary & Description</th>
                <th scope="col" className="py-3 px-4 text-center min-w-[80px]">Rating</th>
                <th scope="col" className="py-3 px-4 text-center min-w-[110px]">Status</th>
                <th scope="col" className="py-3 px-4 text-right min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No feedback items match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-500 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.id}
                      </span>
                      <div className="font-semibold text-slate-800 mt-1">{item.userName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.userRegNo} • <span className="capitalize">{item.role}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{item.targetModule}</span>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 leading-snug">{item.title}</div>
                      <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      {item.adminNotes && (
                        <div className="mt-1 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100 italic">
                          <strong>Note:</strong> "{item.adminNotes}"
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        {item.timestamp}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-0.5 text-amber-500 font-bold font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{item.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status === 'Resolved' && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] text-xs font-semibold text-[#176CB8] hover:bg-blue-50 border border-blue-200 rounded-xl transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Triage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Triage / Status Editing Modal */}
      {activeEditingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none"
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Triage Feedback Ticket: {activeEditingItem.id}
              </h3>
              <button
                type="button"
                onClick={() => setActiveEditingItem(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Report Title
                </span>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">
                  {activeEditingItem.title}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">{activeEditingItem.description}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Update Resolution Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['New', 'Under Review', 'Planned', 'Resolved'] as FeedbackStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left flex items-center justify-between ${
                        newStatus === st
                          ? 'bg-[#183668] text-white border-[#183668]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{st}</span>
                      {newStatus === st && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="admin-note" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Admin Resolution Note (Visible to Student)
                </label>
                <textarea
                  id="admin-note"
                  rows={3}
                  placeholder="e.g. Verified and scheduled for release in sprint v2.1..."
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-900"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
