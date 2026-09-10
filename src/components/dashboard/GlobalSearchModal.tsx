import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { MOCK_ATTENDANCE_RECORDS, MOCK_NAV_CATEGORIES } from '../../services/mockDashboardService';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (id: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search through courses
  const filteredCourses = MOCK_ATTENDANCE_RECORDS.filter(
    (c) =>
      c.courseCode.toLowerCase().includes(cleanQuery) ||
      c.courseTitle.toLowerCase().includes(cleanQuery) ||
      c.facultyName.toLowerCase().includes(cleanQuery) ||
      c.slot.toLowerCase().includes(cleanQuery)
  );

  // Search through nav items
  const allNavItems = MOCK_NAV_CATEGORIES.flatMap((c) =>
    c.items.map((item) => ({ ...item, category: c.label }))
  );
  const filteredNav = allNavItems.filter(
    (n) => n.label.toLowerCase().includes(cleanQuery) || n.category.toLowerCase().includes(cleanQuery)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-search-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <h2 id="global-search-title" className="sr-only">Quick Search Navigation</h2>
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#176CB8] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, attendance, slots, rooms, menus..."
            aria-label="Search courses, attendance, slots, rooms, menus"
            className="flex-1 text-sm font-medium text-slate-900 placeholder:text-slate-500 bg-transparent focus:outline-none min-h-[44px]"
          />
          <kbd className="px-2 py-1 text-[10px] font-mono font-bold bg-slate-100 text-slate-600 rounded border border-slate-200">
            Esc
          </kbd>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search dialog"
            className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Courses Section */}
          {filteredCourses.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-medium px-2 block mb-1.5">
                Registered Courses & Attendance
              </span>
              <div className="space-y-1">
                {filteredCourses.slice(0, 4).map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => {
                      onSelectAction('attendance');
                      onClose();
                    }}
                    className="w-full text-left p-3 min-h-[44px] rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition-colors flex items-center justify-between gap-3 text-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#176CB8] mr-1.5">
                        {course.courseCode}
                      </span>
                      <span className="font-semibold text-slate-900">{course.courseTitle}</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Slot: {course.slot} • Room {course.venue} • {course.facultyName}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {course.attendancePercentage}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Items Section */}
          {filteredNav.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-medium px-2 block mb-1.5">
                Portal Features & Services
              </span>
              <div className="space-y-1">
                {filteredNav.slice(0, 6).map((nav) => (
                  <button
                    key={nav.id}
                    type="button"
                    onClick={() => {
                      onSelectAction(nav.id);
                      onClose();
                    }}
                    className="w-full text-left p-3 min-h-[44px] rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-colors flex items-center justify-between gap-3 text-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8]"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block">{nav.label}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{nav.category}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredCourses.length === 0 && filteredNav.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No results matching &quot;{query}&quot;. Try searching for &quot;Attendance&quot;, &quot;CSE4012&quot;, &quot;Hussain&quot;, or &quot;Outing&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
