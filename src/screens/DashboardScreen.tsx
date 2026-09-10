import React, { useState, useEffect } from 'react';
import {
  MOCK_STUDENT_PROFILE,
  MOCK_ACADEMIC_KPIS,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_TODAY_SCHEDULE,
  MOCK_DIGITAL_ASSIGNMENTS,
  MOCK_SPOTLIGHT_ALERT,
  MOCK_NAV_CATEGORIES,
} from '../services/mockDashboardService';
import { TopNavbar } from '../components/dashboard/TopNavbar';
import { SidebarNav } from '../components/dashboard/SidebarNav';
import { SpotlightBanner } from '../components/dashboard/SpotlightBanner';
import { VitalsSummaryCards } from '../components/dashboard/VitalsSummaryCards';
import { TodayScheduleWidget } from '../components/dashboard/TodayScheduleWidget';
import { AttendancePulseWidget } from '../components/dashboard/AttendancePulseWidget';
import { UpcomingTasksWidget } from '../components/dashboard/UpcomingTasksWidget';
import { QuickActionsBar } from '../components/dashboard/QuickActionsBar';
import { TimetableModal } from '../components/dashboard/TimetableModal';
import { AttendanceModal } from '../components/dashboard/AttendanceModal';
import { GlobalSearchModal } from '../components/dashboard/GlobalSearchModal';

// Dedicated Subpage Views
import { AttendancePageView } from '../components/dashboard/pages/AttendancePageView';
import { TimetablePageView } from '../components/dashboard/pages/TimetablePageView';
import { MarksGradesPageView } from '../components/dashboard/pages/MarksGradesPageView';
import { AssignmentsPageView } from '../components/dashboard/pages/AssignmentsPageView';
import { HostelOutingPageView } from '../components/dashboard/pages/HostelOutingPageView';
import { ProfilePageView } from '../components/dashboard/pages/ProfilePageView';
import { PaymentsPageView } from '../components/dashboard/pages/PaymentsPageView';

export const DashboardScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [activeSection, setActiveSection] = useState('overview');

  // Modals state
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener and Escape to return to overview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape' && activeSection !== 'overview' && !isSearchOpen && !isTimetableOpen && !isAttendanceOpen) {
        setActiveSection('overview');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, isSearchOpen, isTimetableOpen, isAttendanceOpen]);

  const handleSelectSection = (sectionId: string) => {
    // Map course search clicks or subpages to activeSection
    if (sectionId.startsWith('course-')) {
      setActiveSection('attendance');
    } else {
      setActiveSection(sectionId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    switch (activeSection) {
      case 'attendance':
        return (
          <AttendancePageView
            records={MOCK_ATTENDANCE_RECORDS}
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'timetable':
      case 'coursepage':
        return (
          <TimetablePageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'marks':
      case 'grades':
      case 'gradehistory':
      case 'examinations':
        return (
          <MarksGradesPageView
            initialTab={
              activeSection === 'grades'
                ? 'grades'
                : activeSection === 'gradehistory'
                ? 'gradehistory'
                : 'marks'
            }
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'assignments':
      case 'academics':
        return (
          <AssignmentsPageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'hostelouting':
      case 'weekendouting':
      case 'generalouting':
      case 'hostel':
      case 'biometric':
      case 'mentor':
        return (
          <HostelOutingPageView
            initialTab="history"
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'hostelroom':
      case 'roominfo':
      case 'room':
        return (
          <HostelOutingPageView
            initialTab="room"
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'studentprofile':
      case 'profile':
      case 'biodata':
        return (
          <ProfilePageView
            student={MOCK_STUDENT_PROFILE}
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'receipts':
      case 'onlinepayments':
      case 'payments':
      case 'bonafide':
      case 'transcript':
      case 'bankinfo':
        return (
          <PaymentsPageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'overview':
      default:
        return (
          <div className="space-y-4 sm:space-y-5">
            {/* 1. Urgent Spotlight & COE Assessment Alert */}
            <SpotlightBanner alert={MOCK_SPOTLIGHT_ALERT} />

            {/* 2. Academic Vitals Strip (4 KPI Cards) */}
            <VitalsSummaryCards
              kpis={MOCK_ACADEMIC_KPIS}
              onNavigateToAttendance={() => setActiveSection('attendance')}
              onNavigateToGrades={() => setActiveSection('gradehistory')}
              onNavigateToCourses={() => setActiveSection('timetable')}
            />

            {/* 3. Multi-Column Cockpit Layout (60% / 40%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
              {/* Left Column: Schedule & Quick Actions (7 cols on lg = ~58%) */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <TodayScheduleWidget
                  schedule={MOCK_TODAY_SCHEDULE}
                  onOpenFullTimetable={() => setActiveSection('timetable')}
                />

                <QuickActionsBar
                  onOpenTimetable={() => setActiveSection('timetable')}
                  onOpenOuting={() => setActiveSection('hostelouting')}
                  onOpenGrades={() => setActiveSection('grades')}
                  onOpenReceipts={() => setActiveSection('payments')}
                  onOpenCoursePage={() => setActiveSection('timetable')}
                />
              </div>

              {/* Right Column: Attendance Margin & Upcoming Tasks (5 cols on lg = ~42%) */}
              <div className="lg:col-span-5 space-y-4 sm:space-y-5">
                <AttendancePulseWidget
                  records={MOCK_ATTENDANCE_RECORDS}
                  onOpenFullAttendance={() => setActiveSection('attendance')}
                />

                <UpcomingTasksWidget
                  assignments={MOCK_DIGITAL_ASSIGNMENTS}
                  onOpenAssignments={() => setActiveSection('assignments')}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col antialiased">
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.4.1) */}
      <a
        href="#main-dashboard-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:py-2.5 focus:px-4 focus:bg-[#176CB8] focus:text-white focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#176CB8] text-xs font-bold transition-all cursor-pointer"
      >
        Skip to Main Dashboard Content
      </a>

      {/* Persistent Top Header */}
      <TopNavbar
        student={MOCK_STUDENT_PROFILE}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => alert('Notifications:\n1. [COE] Online Quiz Link Active\n2. [Hostel] Weekend Outing Approved by Mentor\n3. [Academics] CSE4012 Assignment Due Nov 10')}
        onSelectSection={handleSelectSection}
      />

      {/* Main Workspace with Collapsible Sidebar Rail */}
      <div className="flex-1 flex min-w-0">
        {/* Navigation Sidebar */}
        <SidebarNav
          categories={MOCK_NAV_CATEGORIES}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
        />

        {/* Main Cockpit Canvas */}
        <main
          id="main-dashboard-content"
          role="main"
          className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 overflow-y-auto"
        >
          {/* Render Active View (Dashboard Home or Dedicated Subpage) */}
          {renderCurrentView()}

          {/* Bottom Institutional Accreditation Bar */}
          <footer className="pt-4 pb-2 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Session Authenticated: <strong>{MOCK_STUDENT_PROFILE.regNo}</strong> ({MOCK_STUDENT_PROFILE.name})</span>
            </div>
            <span>© 2026 VIT-AP University. Central Academic & Student Administration.</span>
          </footer>
        </main>
      </div>

      {/* Accessible Global Modals */}
      <TimetableModal
        isOpen={isTimetableOpen}
        onClose={() => setIsTimetableOpen(false)}
      />

      <AttendanceModal
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAction={handleSelectSection}
      />
    </div>
  );
};
