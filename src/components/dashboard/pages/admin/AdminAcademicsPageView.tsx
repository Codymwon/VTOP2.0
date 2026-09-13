import React, { useState } from 'react';
import { PageBreadcrumbHeader } from '../PageBreadcrumbHeader';
import { MOCK_ADMIN_ALLOCATIONS } from '../../../../services/mockAdminService';
import { AcademicAllocation } from '../../../../types/admin';
import {
  Building2,
  Search,
  Download,
  TrendingUp,
  Layers,
} from 'lucide-react';

interface AdminAcademicsPageViewProps {
  onBackToDashboard: () => void;
}

export const AdminAcademicsPageView: React.FC<AdminAcademicsPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [allocations] = useState<AcademicAllocation[]>(MOCK_ADMIN_ALLOCATIONS);
  const [blockFilter, setBlockFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAllocations = allocations.filter((item) => {
    if (blockFilter !== 'ALL' && !item.block.includes(blockFilter)) return false;
    if (
      searchQuery &&
      !item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.facultyAssigned.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.room.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageBreadcrumbHeader
        category="Academic Operations"
        title="Classroom Utilization & Scheduling Audit"
        subtitle="Institutional Space Allocation, Faculty Course Workloads, and Lecture Hall Occupancy Rates"
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <button
            type="button"
            onClick={() => alert('Exporting classroom occupancy matrix...')}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Export Matrix</span>
          </button>
        }
      />

      {/* Utilization Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Avg Campus Occupancy
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">94.0%</div>
            <div className="text-xs text-emerald-800 font-bold mt-0.5">High Efficiency Band</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Central Block (CB)
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">93.4%</div>
            <div className="text-xs text-slate-500 mt-0.5">38 Lecture Halls Active</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#176CB8] flex items-center justify-center">
            <Building2 className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Academic Blocks 1 & 2
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">94.7%</div>
            <div className="text-xs text-slate-500 mt-0.5">42 Lecture Halls Active</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Layers className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Allocation Matrix Table */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Active Room Allocations & Enrollment Loads ({filteredAllocations.length})
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              className="px-3 py-2 min-h-[44px] text-xs rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] font-bold"
            >
              <option value="ALL">All Academic Blocks</option>
              <option value="Central Block">Central Block (CB)</option>
              <option value="Academic Block 1">Academic Block 1 (AB-1)</option>
              <option value="Academic Block 2">Academic Block 2 (AB-2)</option>
            </select>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course or faculty..."
                className="w-full pl-8 pr-3 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="py-2.5 px-3">Course Code & Title</th>
                <th scope="col" className="py-2.5 px-3">Assigned Faculty</th>
                <th scope="col" className="py-2.5 px-3">Room & Block</th>
                <th scope="col" className="py-2.5 px-3 text-center">Slot</th>
                <th scope="col" className="py-2.5 px-3 text-center">Capacity / Enrolled</th>
                <th scope="col" className="py-2.5 px-3 text-right">Occupancy Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAllocations.map((alloc, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{alloc.courseCode}</div>
                    <div className="text-slate-600 font-medium">{alloc.courseTitle}</div>
                    <div className="text-[10px] text-slate-500">{alloc.department}</div>
                  </td>

                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {alloc.facultyAssigned}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-slate-900">{alloc.room}</span>
                    <div className="text-[11px] text-slate-500">{alloc.block}</div>
                  </td>

                  <td className="py-3 px-3 text-center font-mono font-bold text-[#176CB8]">
                    {alloc.slot}
                  </td>

                  <td className="py-3 px-3 text-center font-mono tabular-nums">
                    <span className="font-bold text-slate-900">{alloc.enrolled}</span>
                    <span className="text-slate-500"> / {alloc.capacity}</span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden hidden sm:block">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${alloc.occupancyRate}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {alloc.occupancyRate.toFixed(1)}%
                      </span>
                    </div>
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
