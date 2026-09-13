import React, { useState } from 'react';
import { PageBreadcrumbHeader } from '../PageBreadcrumbHeader';
import { MOCK_FACULTY_ADVISEES } from '../../../../services/mockFacultyService';
import { FacultyAdvisee } from '../../../../types/faculty';
import {
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Search,
  Check,
  X,
} from 'lucide-react';

interface FacultyProctorPageViewProps {
  onBackToDashboard: () => void;
}

export const FacultyProctorPageView: React.FC<FacultyProctorPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [advisees, setAdvisees] = useState<FacultyAdvisee[]>(MOCK_FACULTY_ADVISEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAlertsOnly, setFilterAlertsOnly] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Leave approval action
  const handleApproveLeave = (studentRegNo: string, leaveId: string) => {
    setAdvisees((prev) =>
      prev.map((adv) => {
        if (adv.regNo !== studentRegNo) return adv;
        return {
          ...adv,
          pendingLeaveRequests: adv.pendingLeaveRequests.filter((r) => r.id !== leaveId),
        };
      })
    );
    setNoticeMessage(`Approved leave pass for student ${studentRegNo}. Forwarded to Warden Desk.`);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  const handleRejectLeave = (studentRegNo: string, leaveId: string) => {
    setAdvisees((prev) =>
      prev.map((adv) => {
        if (adv.regNo !== studentRegNo) return adv;
        return {
          ...adv,
          pendingLeaveRequests: adv.pendingLeaveRequests.filter((r) => r.id !== leaveId),
        };
      })
    );
    setNoticeMessage(`Rejected leave request for student ${studentRegNo}.`);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  const filteredAdvisees = advisees.filter((adv) => {
    if (filterAlertsOnly && adv.alertLevel === 'normal') return false;
    if (
      searchQuery &&
      !adv.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !adv.regNo.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalPendingLeaves = advisees.reduce(
    (acc, cur) => acc + cur.pendingLeaveRequests.length,
    0
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageBreadcrumbHeader
        category="Student Mentorship"
        title="Faculty Proctor & Advisee Roster"
        subtitle="Assigned Student Advisees, Academic Warning Flags, and Hostel Leave Approvals"
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
      />

      {noticeMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* Proctor Vitals Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Advisees
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">24 Students</div>
            <div className="text-xs text-slate-500 mt-0.5">B.Tech Computer Science</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#176CB8] flex items-center justify-center">
            <UserCheck className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Academic Caution
            </span>
            <div className="text-2xl font-black text-rose-800 mt-1">2 Advisees</div>
            <div className="text-xs text-rose-700 font-medium mt-0.5">Low Attendance (&lt;75%)</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Leave Requests
            </span>
            <div className="text-2xl font-black text-amber-800 mt-1">
              {totalPendingLeaves} Pending
            </div>
            <div className="text-xs text-amber-700 font-medium mt-0.5">Parent Consent Verified</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Calendar className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Pending Leave Requests Section */}
      {totalPendingLeaves > 0 && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <span>Pending Outing Requests Awaiting Mentor Approval</span>
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {totalPendingLeaves} Action Required
            </span>
          </div>

          <div className="space-y-3">
            {advisees.flatMap((adv) =>
              adv.pendingLeaveRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{req.studentName}</span>
                      <span className="font-mono font-bold text-slate-700">({req.studentRegNo})</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {req.outingType}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Parent Verified: {req.parentContact}
                      </span>
                    </div>

                    <div className="text-slate-700">
                      Destination: <strong>{req.placeOfVisit}</strong> • Schedule: {req.fromDate} → {req.toDate}
                    </div>
                    <div className="text-slate-500 italic">
                      Reason: "{req.reason}"
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApproveLeave(req.studentRegNo, req.id)}
                      className="px-3.5 py-2 min-h-[44px] rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Approve Outing</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectLeave(req.studentRegNo, req.id)}
                      className="px-3 py-2 min-h-[44px] rounded-xl bg-white hover:bg-rose-50 active:scale-[0.98] text-rose-800 border border-rose-200 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                    >
                      <X className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Advisee Roster Table */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Assigned Advisees List ({filteredAdvisees.length})
            </h3>
            <button
              type="button"
              onClick={() => setFilterAlertsOnly(!filterAlertsOnly)}
              className={`text-xs font-bold px-3 py-2 min-h-[44px] rounded-xl transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                filterAlertsOnly
                  ? 'bg-rose-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filterAlertsOnly ? 'Showing Alerts Only' : 'Filter Caution Alerts'}
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or reg no..."
              className="w-full pl-9 pr-3 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="py-2.5 px-3">Student Name & Reg No</th>
                <th scope="col" className="py-2.5 px-3">Hostel & Room</th>
                <th scope="col" className="py-2.5 px-3 text-center">CGPA</th>
                <th scope="col" className="py-2.5 px-3 text-center">Attendance Rate</th>
                <th scope="col" className="py-2.5 px-3 text-center">Academic Status</th>
                <th scope="col" className="py-2.5 px-3 text-right">Parent Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdvisees.map((stu) => {
                const isCritical = stu.alertLevel === 'critical';
                const isCaution = stu.alertLevel === 'caution';

                return (
                  <tr key={stu.regNo} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{stu.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{stu.regNo} • {stu.program}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{stu.hostelBlock}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Room: {stu.roomNo}</div>
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 text-sm tabular-nums">
                      {stu.cgpa.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block font-mono font-bold px-2 py-0.5 rounded tabular-nums ${
                          stu.attendancePercentage < 75
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {stu.attendancePercentage.toFixed(1)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                          Critical Alert (&lt;75%)
                        </span>
                      ) : isCaution ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Caution Watch
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-800">
                          Good Standing
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      <a
                        href={`tel:${stu.parentContact}`}
                        className="hover:text-[#176CB8] hover:underline"
                      >
                        {stu.parentContact}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
