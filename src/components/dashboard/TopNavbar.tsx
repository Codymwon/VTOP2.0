import React, { useState, useEffect, useRef } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile } from '../../types/dashboard';
import {
  Menu,
  X,
  Search,
  Home,
  Printer,
  Star,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Calendar,
} from 'lucide-react';

interface TopNavbarProps {
  student: StudentProfile;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  onSelectSection?: (sectionId: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  student,
  isSidebarOpen,
  onToggleSidebar,
  onOpenSearch,
  onOpenNotifications,
  unreadCount = 3,
  onSelectSection,
}) => {
  const { logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard trap for profile menu (Escape key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isProfileMenuOpen) {
        setIsProfileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProfileMenuOpen]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 w-full h-16 border-b border-white/15 text-white shadow-md select-none transition-all"
      style={{
        background: 'linear-gradient(135deg, #183668 0%, #2455A3 45%, #1B4F72 100%)',
      }}
    >
      <div className="h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Sidebar Toggle & Brand Seal */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Collapse Navigation Sidebar' : 'Expand Navigation Sidebar'}
            aria-expanded={isSidebarOpen}
            className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-blue-100 hover:text-white hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] cursor-pointer"
          >
            {isSidebarOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>

          <div className="flex items-center gap-2">
            <BrandLogo variant="dark" size="sm" />
          </div>

          {/* Quick Utility Icons (Hidden on small mobile, visible sm+) */}
          <div className="hidden md:flex items-center gap-1 border-l border-white/15 pl-2 ml-1">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onSelectSection?.('overview');
              }}
              aria-label="Home Dashboard"
              title="Home Dashboard"
              className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] cursor-pointer"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={handlePrint}
              aria-label="Print Current View"
              title="Print Page"
              className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] cursor-pointer"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => alert('Current semester saved to your favorites bar!')}
              aria-label="Favorite this view"
              title="Add to Favorites"
              className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] cursor-pointer"
            >
              <Star className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Center: Global Search Bar (<kbd>Ctrl K</kbd>) */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden sm:block">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-blue-100 hover:text-white text-xs font-medium transition-all shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-200" aria-hidden="true" />
              <span className="truncate">Search courses, attendance, timetable...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white/15 border border-white/20 rounded text-white shadow-xs">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Semester Badge, Notifications, and Student Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Semester Badge */}
          <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-blue-100 font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#5DADE2]" aria-hidden="true" />
            <span>{student.semester}</span>
          </div>

          {/* Search Trigger for Mobile */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Open Search"
            className="sm:hidden p-2 min-h-[44px] min-w-[44px] rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] cursor-pointer"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Notifications Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label={`Notifications (${unreadCount} unread)`}
            className="relative p-2 min-h-[44px] min-w-[44px] rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] cursor-pointer"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-[#900C3F] text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#183668] font-mono tabular-nums shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Student Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              id="student-profile-button"
              aria-haspopup="true"
              aria-expanded={isProfileMenuOpen}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#176CB8] border border-white/30 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                AM
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="font-mono font-bold text-xs text-white leading-tight tracking-wide">
                  {student.regNo}
                </span>
                <span className="text-[10px] text-blue-200/80 uppercase font-semibold leading-tight">
                  Student
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-blue-200 transition-transform ${
                  isProfileMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div
                role="menu"
                aria-labelledby="student-profile-button"
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                  <p className="text-xs font-bold text-slate-900 leading-snug">
                    {student.name}
                  </p>
                  <p className="text-[11px] font-mono font-semibold text-[#176CB8] mt-0.5">
                    {student.regNo} • {student.program}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    <span>Hosteller: {student.hostelBlock}, Room {student.roomNo}</span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onSelectSection?.('studentprofile');
                    }}
                    role="menuitem"
                    className="w-full flex items-center gap-2.5 px-4 py-3 min-h-[44px] text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
                  >
                    <User className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    <span>View Student Profile & Biodata</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onSelectSection?.('timetable');
                    }}
                    role="menuitem"
                    className="w-full flex items-center gap-2.5 px-4 py-3 min-h-[44px] text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
                  >
                    <Calendar className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    <span>Academic Timetable & Schedule</span>
                  </button>
                </div>

                {/* Destructive / Sign Out Action (Isolated per UI/UX Pro Max rule) */}
                <div className="pt-1 mt-1 border-t border-slate-100">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 min-h-[44px] text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" aria-hidden="true" />
                    <span>Sign Out from VTOP</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
