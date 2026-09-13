import React, { useState } from 'react';
import { PageBreadcrumbHeader } from '../PageBreadcrumbHeader';
import { MOCK_ADMIN_USER_DIRECTORY } from '../../../../services/mockAdminService';
import { UserDirectoryItem } from '../../../../types/admin';
import {
  Search,
  Download,
  CheckCircle2,
} from 'lucide-react';

interface AdminUserDirectoryPageViewProps {
  onBackToDashboard: () => void;
}

export const AdminUserDirectoryPageView: React.FC<AdminUserDirectoryPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [users] = useState<UserDirectoryItem[]>(MOCK_ADMIN_USER_DIRECTORY);
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'student' | 'faculty' | 'staff' | 'admin'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (
      searchQuery &&
      !u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !u.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !u.departmentOrSchool.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !u.biometricId.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageBreadcrumbHeader
        category="Institutional Registry"
        title="User & Biometric Identity Directory"
        subtitle="Searchable Institutional Directory of Students, Faculty, and Staff with Biometric Credentials"
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <button
            type="button"
            onClick={() => alert('Exporting directory audit list...')}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Export Directory</span>
          </button>
        }
      />

      {/* Directory Table */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl flex-wrap">
            <button
              type="button"
              onClick={() => setRoleFilter('ALL')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                roleFilter === 'ALL' ? 'bg-white text-[#183668] shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              All Members ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('student')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                roleFilter === 'student' ? 'bg-white text-[#183668] shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Students
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('faculty')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                roleFilter === 'faculty' ? 'bg-white text-[#183668] shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('staff')}
              className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] ${
                roleFilter === 'staff' ? 'bg-white text-[#183668] shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Staff
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, name, or school..."
              className="w-full pl-8 pr-3 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="py-2.5 px-3">Institutional ID & Name</th>
                <th scope="col" className="py-2.5 px-3">Role</th>
                <th scope="col" className="py-2.5 px-3">Department / School</th>
                <th scope="col" className="py-2.5 px-3">Biometric Badge ID</th>
                <th scope="col" className="py-2.5 px-3 text-center">Status</th>
                <th scope="col" className="py-2.5 px-3 text-right">Last System Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] font-mono text-[#176CB8] font-bold tabular-nums">{u.id}</div>
                    <div className="text-[10px] text-slate-500">{u.designationOrDegree}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        u.role === 'admin' || u.role === 'staff'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'faculty'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-3 max-w-xs text-slate-700">
                    {u.departmentOrSchool}
                    <div className="text-[10px] text-slate-500 mt-0.5">{u.email}</div>
                  </td>

                  <td className="py-3 px-3 font-mono font-semibold text-slate-800 tabular-nums">
                    {u.biometricId}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums">
                    {u.lastLogin}
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
