import React, { useState, useEffect } from 'react';
import { NavCategory } from '../../types/dashboard';
import { BrandLogo } from '../common/BrandLogo';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Building2,
  CreditCard,
  UserCheck,
  ChevronDown,
  LifeBuoy,
  X,
  PanelLeftClose,
  Calendar,
  CheckCircle2,
  FileText,
  Award,
  MapPin,
  Receipt,
  User,
  Compass,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarNavProps {
  categories: NavCategory[];
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  onToggle?: () => void;
}

const CATEGORY_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  BookOpen: (props) => <BookOpen {...props} />,
  GraduationCap: (props) => <GraduationCap {...props} />,
  Building2: (props) => <Building2 {...props} />,
  CreditCard: (props) => <CreditCard {...props} />,
  UserCheck: (props) => <UserCheck {...props} />,
  Award: (props) => <Award {...props} />,
};

const SUB_ITEM_ICONS: Record<string, React.FC<{ className?: string }>> = {
  attendance: CheckCircle2,
  timetable: Calendar,
  assignments: FileText,
  marks: Award,
  grades: GraduationCap,
  hostelouting: MapPin,
  hostelroom: Building2,
  payments: Receipt,
  studentprofile: User,
  // Faculty Sub-items
  facultycourses: BookOpen,
  facultyattendance: CheckCircle2,
  facultygrading: Award,
  facultyproctor: UserCheck,
  facultyduties: Calendar,
  // Admin Sub-items
  adminouting: MapPin,
  admingate: ShieldCheck,
  adminacademics: BookOpen,
  adminfinance: Receipt,
  admincirculars: Radio,
  adminusers: User,
  // Backward compatibility
  weekendouting: MapPin,
  generalouting: MapPin,
  roominfo: Building2,
  receipts: Receipt,
  coursepage: Compass,
  helpdesk: LifeBuoy,
};

export const SidebarNav: React.FC<SidebarNavProps> = ({
  categories,
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
  onToggle,
}) => {
  const { user } = useAuth();
  // Category headings are collapsed by default to keep the sidebar compact and clean
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      academics: false,
      examinations: false,
      hostel: false,
      payments: false,
      profile: false,
      evaluation: false,
      mentorship: false,
      administration: false,
      operations: false,
      finance: false,
      communications: false,
      directory: false,
    };
    if (activeSection && activeSection !== 'overview') {
      const parentCat = categories.find(
        (cat) => cat.id === activeSection || cat.items.some((item) => item.id === activeSection)
      );
      if (parentCat) {
        initial[parentCat.id] = true;
      }
    }
    return initial;
  });

  // Keep the active section's category automatically expanded when route changes
  useEffect(() => {
    if (activeSection === 'overview') return;
    const parentCat = categories.find(
      (cat) => cat.id === activeSection || cat.items.some((item) => item.id === activeSection)
    );
    if (parentCat) {
      setExpandedCategories((prev) => ({
        ...prev,
        [parentCat.id]: true,
      }));
    }
  }, [activeSection, categories]);

  // Mobile Escape key dismiss listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && window.innerWidth < 1024) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleItemClick = (itemId: string) => {
    onSelectSection(itemId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // Reusable core navigation menu (compact and without redundant student details)
  const renderNavList = () => (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Scrollable Navigation Body */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
        {/* Top: Primary Dashboard Overview Button */}
        <div>
          <button
            type="button"
            onClick={() => handleItemClick('overview')}
            aria-current={activeSection === 'overview' ? 'page' : undefined}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#176CB8] ${
              activeSection === 'overview'
                ? 'bg-[#183668] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                activeSection === 'overview'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-[#176CB8]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
            <span className="flex-1 text-left text-xs truncate">Dashboard Overview</span>
          </button>
        </div>

        <div className="h-px bg-slate-100 my-1 mx-1" role="separator" />

        {/* Categorized Navigation Groups */}
        <div className="space-y-0.5">
          {categories.map((cat) => {
            const IconComponent = CATEGORY_ICON_MAP[cat.iconName] || BookOpen;
            const isExpanded = !!expandedCategories[cat.id];
            const hasActiveChild =
              activeSection === cat.id || cat.items.some((item) => item.id === activeSection);

            return (
              <div key={cat.id} className="space-y-0.5">
                {/* Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  aria-expanded={isExpanded}
                  className={`w-full flex items-center justify-between px-2.5 py-2 min-h-[44px] text-left rounded-lg transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#176CB8] ${
                    hasActiveChild
                      ? 'bg-[#183668]/5 text-[#183668] font-bold border border-[#176CB8]/20'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        hasActiveChild
                          ? 'bg-[#183668]/10 text-[#176CB8]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IconComponent className="w-3 h-3" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-bold tracking-tight truncate">
                      {cat.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {cat.badge && (
                      <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1 py-0.5 rounded border border-slate-200/60 tabular-nums">
                        {cat.badge}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        isExpanded ? 'rotate-0 text-slate-700' : '-rotate-90 text-slate-500'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                {/* Direct 1-Tap Sub-item Links */}
                {isExpanded && (
                  <div className="pl-2.5 pr-0.5 space-y-0.5 border-l border-slate-100 ml-3 py-0.5 animate-in fade-in duration-100">
                    {cat.items.map((item) => {
                      const SubIcon = SUB_ITEM_ICONS[item.id] || FileText;
                      const isItemActive = activeSection === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleItemClick(item.id)}
                          aria-current={isItemActive ? 'page' : undefined}
                          className={`w-full flex items-center justify-between px-2.5 py-2 min-h-[44px] rounded-lg text-[11px] transition-all active:scale-[0.98] cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#176CB8] ${
                            isItemActive
                              ? 'bg-[#183668]/10 text-[#183668] font-bold border-l-2 border-[#176CB8] pl-2'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <SubIcon
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isItemActive ? 'text-[#176CB8]' : 'text-slate-500'
                              }`}
                              aria-hidden="true"
                            />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.badge && (
                            <span
                              className={`text-[9px] font-bold px-1 py-0.5 rounded shrink-0 tabular-nums ${
                                isItemActive
                                  ? 'bg-[#183668] text-white'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer: IT Helpdesk Contact */}
      <div className="p-2.5 px-3 border-t border-slate-100 bg-slate-50/70 shrink-0">
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <a
            href="tel:+918632341040"
            className="flex items-center gap-1.5 hover:text-[#176CB8] transition-colors focus:outline-none focus-visible:underline min-h-[36px] py-1.5"
            title="IT Helpdesk Hotline"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-[#176CB8]" aria-hidden="true" />
            <span>Helpdesk: Ext. 1040</span>
          </a>
          <span className="font-semibold text-slate-500">VIT-AP</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE DRAWER (Only on mobile when isOpen is true)                     */}
      {/* Compact sliding drawer (w-68 = 272px instead of wide 320px)               */}
      {/* ========================================================================= */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            role="presentation"
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Panel */}
          <aside
            role="navigation"
            aria-label="Portal Mobile Navigation"
            className="relative z-50 w-68 max-w-[80vw] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200 select-none"
          >
            {/* Mobile Header with Official Brand Seal and Dismiss Button */}
            <div className="bg-gradient-to-r from-[#183668] via-[#2455A3] to-[#183668] text-white px-3.5 py-3 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <BrandLogo variant="dark" size="sm" />
                <div className="min-w-0 border-l border-white/20 pl-2">
                  <div className="text-[11px] font-bold tracking-tight text-white truncate">
                    {user?.role === 'admin'
                      ? 'ADMIN CONSOLE'
                      : user?.role === 'faculty'
                      ? 'FACULTY PORTAL'
                      : 'VTOP 2.0 PORTAL'}
                  </div>
                  <div className="text-[9px] text-blue-200 truncate">
                    {user?.role === 'admin'
                      ? 'Operations & Governance'
                      : user?.role === 'faculty'
                      ? 'Academic Navigation'
                      : 'Student Navigation'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 active:scale-[0.98] text-white flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation List */}
            {renderNavList()}
          </aside>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DESKTOP SIDEBAR (Visible on lg+ screens)                               */}
      {/* Compact 224px (w-56 / xl:w-60) sidebar. Direct 1-click access.            */}
      {/* ========================================================================= */}
      <aside
        role="navigation"
        aria-label="Portal Navigation"
        className={`hidden lg:flex flex-col sticky top-16 h-[calc(100dvh-4rem)] bg-white border-r border-slate-200 shrink-0 select-none z-30 transition-all duration-200 ${
          isOpen ? 'w-56 xl:w-60' : 'w-0 overflow-hidden border-none'
        }`}
      >
        {isOpen && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Desktop Header with Collapse Button */}
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                {user?.role === 'admin'
                  ? 'Administrator Cockpit'
                  : user?.role === 'faculty'
                  ? 'Faculty Cockpit'
                  : 'Portal Navigation'}
              </span>
              {onToggle && (
                <button
                  type="button"
                  onClick={onToggle}
                  title="Collapse Sidebar"
                  aria-label="Collapse Navigation Sidebar"
                  className="w-9 h-9 min-w-[36px] min-h-[36px] p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 active:scale-[0.98] flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#176CB8] cursor-pointer"
                >
                  <PanelLeftClose className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Navigation List */}
            {renderNavList()}
          </div>
        )}
      </aside>
    </>
  );
};
