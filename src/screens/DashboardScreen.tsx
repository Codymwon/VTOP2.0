import React, { useState, useEffect } from 'react';
import {
  MOCK_STUDENT_PROFILE,
  MOCK_NAV_CATEGORIES,
  MOCK_ATTENDANCE_RECORDS,
} from '../services/mockDashboardService';
import { MOCK_FACULTY_NAV_CATEGORIES } from '../services/mockFacultyService';
import { MOCK_ADMIN_NAV_CATEGORIES } from '../services/mockAdminService';
import { TopNavbar } from '../components/dashboard/TopNavbar';
import { SidebarNav } from '../components/dashboard/SidebarNav';
import { GlobalSearchModal } from '../components/dashboard/GlobalSearchModal';
import { useAuth } from '../context/AuthContext';

// Role-Specific Core Dashboard Views
import { StudentDashboardView } from '../components/dashboard/views/StudentDashboardView';
import { FacultyDashboardView } from '../components/dashboard/views/FacultyDashboardView';
import { AdminDashboardView } from '../components/dashboard/views/AdminDashboardView';

// Dedicated Student Subpage Views
import { AttendancePageView } from '../components/dashboard/pages/AttendancePageView';
import { TimetablePageView } from '../components/dashboard/pages/TimetablePageView';
import { MarksGradesPageView } from '../components/dashboard/pages/MarksGradesPageView';
import { AssignmentsPageView } from '../components/dashboard/pages/AssignmentsPageView';
import { HostelOutingPageView } from '../components/dashboard/pages/HostelOutingPageView';
import { ProfilePageView } from '../components/dashboard/pages/ProfilePageView';
import { PaymentsPageView } from '../components/dashboard/pages/PaymentsPageView';
import { CoursesPageView } from '../components/dashboard/pages/CoursesPageView';
import { StudentFeedbackPageView } from '../components/dashboard/pages/StudentFeedbackPageView';

// Dedicated Faculty Subpage Views
import { FacultyCoursesPageView } from '../components/dashboard/pages/faculty/FacultyCoursesPageView';
import { FacultyAttendancePageView } from '../components/dashboard/pages/faculty/FacultyAttendancePageView';
import { FacultyGradingPageView } from '../components/dashboard/pages/faculty/FacultyGradingPageView';
import { FacultyProctorPageView } from '../components/dashboard/pages/faculty/FacultyProctorPageView';
import { FacultyDutiesPageView } from '../components/dashboard/pages/faculty/FacultyDutiesPageView';

// Dedicated Admin Subpage Views
import { AdminOutingDeskPageView } from '../components/dashboard/pages/admin/AdminOutingDeskPageView';
import { AdminAcademicsPageView } from '../components/dashboard/pages/admin/AdminAcademicsPageView';
import { AdminFinanceAuditPageView } from '../components/dashboard/pages/admin/AdminFinanceAuditPageView';
import { AdminCircularsPageView } from '../components/dashboard/pages/admin/AdminCircularsPageView';
import { AdminUserDirectoryPageView } from '../components/dashboard/pages/admin/AdminUserDirectoryPageView';
import { AdminFeedbackPageView } from '../components/dashboard/pages/admin/AdminFeedbackPageView';
import { QuickFeedbackModal } from '../components/dashboard/QuickFeedbackModal';

export const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [activeSection, setActiveSection] = useState('overview');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener and Escape to return to overview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape' && activeSection !== 'overview' && !isSearchOpen) {
        setActiveSection('overview');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, isSearchOpen]);

  // Dynamically resolve navigation categories based on active role
  const navCategories =
    user?.role === 'admin'
      ? MOCK_ADMIN_NAV_CATEGORIES
      : user?.role === 'faculty'
      ? MOCK_FACULTY_NAV_CATEGORIES
      : MOCK_NAV_CATEGORIES;

  const handleSelectSection = (sectionId: string) => {
    // Map course search clicks or subpages to activeSection
    if (sectionId.startsWith('course-')) {
      if (user?.role === 'faculty') {
        setActiveSection('facultycourses');
      } else {
        setActiveSection('courses');
      }
    } else {
      setActiveSection(sectionId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    switch (activeSection) {
      // -----------------------------------------------------------------------
      // 1. STUDENT SUBPAGES
      // -----------------------------------------------------------------------
      case 'courses':
      case 'coursepage':
        if (user?.role === 'faculty') {
          return (
            <FacultyCoursesPageView
              onBackToDashboard={() => setActiveSection('overview')}
            />
          );
        }
        return (
          <CoursesPageView
            onBackToDashboard={() => setActiveSection('overview')}
            onNavigateToSection={handleSelectSection}
          />
        );

      case 'attendance':
        return (
          <AttendancePageView
            records={MOCK_ATTENDANCE_RECORDS}
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'timetable':
        return (
          <TimetablePageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'examschedule':
      case 'marks':
      case 'grades':
      case 'gradehistory':
      case 'examinations':
        return (
          <MarksGradesPageView
            initialTab={
              activeSection === 'examschedule'
                ? 'schedule'
                : activeSection === 'grades'
                ? 'grades'
                : activeSection === 'gradehistory'
                ? 'gradehistory'
                : activeSection === 'marks'
                ? 'marks'
                : 'schedule'
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

      case 'feedback':
      case 'studentfeedback':
        return (
          <StudentFeedbackPageView
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

      // -----------------------------------------------------------------------
      // 2. FACULTY SUBPAGES
      // -----------------------------------------------------------------------
      case 'facultycourses':
        return (
          <FacultyCoursesPageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'facultyattendance':
        return (
          <FacultyAttendancePageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'facultygrading':
        return (
          <FacultyGradingPageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'facultyproctor':
        return (
          <FacultyProctorPageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'facultyduties':
        return (
          <FacultyDutiesPageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      // -----------------------------------------------------------------------
      // 3. ADMINISTRATOR SUBPAGES
      // -----------------------------------------------------------------------
      case 'adminouting':
      case 'admingate':
        return (
          <AdminOutingDeskPageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'adminacademics':
        return (
          <AdminAcademicsPageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'adminfinance':
        return (
          <AdminFinanceAuditPageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'admincirculars':
        return (
          <AdminCircularsPageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'adminusers':
        return (
          <AdminUserDirectoryPageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      case 'adminfeedback':
        return (
          <AdminFeedbackPageView
            onBackToDashboard={() => setActiveSection('overview')}
          />
        );

      // -----------------------------------------------------------------------
      // 4. ROLE-SPECIFIC DASHBOARD HOME VIEW
      // -----------------------------------------------------------------------
      case 'overview':
      default:
        if (user?.role === 'admin') {
          return <AdminDashboardView onNavigateTo={handleSelectSection} />;
        }
        if (user?.role === 'faculty') {
          return <FacultyDashboardView onNavigateTo={handleSelectSection} />;
        }
        return <StudentDashboardView onNavigateTo={handleSelectSection} />;
    }
  };

  const handleNotificationsClick = () => {
    if (user?.role === 'admin') {
      alert(
        'Administrator Alerts:\n1. 47 Hostel Outing Requests awaiting warden review\n2. High-velocity weather advisory broadcasted across campus\n3. 18 Hall ticket fee clearance audits pending'
      );
    } else if (user?.role === 'faculty') {
      alert(
        'Faculty Alerts:\n1. Slot C1+TC1 Attendance pending locking\n2. 28 Digital Assignments pending evaluation\n3. Invigilation Duty: Mid-Term CAT-2 on Wednesday'
      );
    } else {
      alert(
        'Student Notifications:\n1. [COE] Online Quiz Link Active\n2. [Hostel] Weekend Outing Approved by Mentor\n3. [Academics] CSE4012 DA-2 Due Sept 15'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col antialiased">
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.4.1) */}
      <a
        href="#main-dashboard-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:py-2.5 focus:px-4 focus:min-h-[44px] focus:inline-flex focus:items-center focus:bg-[#176CB8] focus:text-white focus:rounded-xl focus:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#176CB8] text-xs font-bold transition-all cursor-pointer"
      >
        Skip to Main Dashboard Content
      </a>

      {/* Persistent Top Header */}
      <TopNavbar
        student={MOCK_STUDENT_PROFILE}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={handleNotificationsClick}
        unreadCount={user?.role === 'admin' ? 47 : user?.role === 'faculty' ? 28 : 3}
        onSelectSection={handleSelectSection}
        onOpenQuickFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* Main Workspace with Collapsible Sidebar Rail */}
      <div className="flex-1 flex min-w-0">
        {/* Navigation Sidebar */}
        <SidebarNav
          categories={navCategories}
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
          {/* Render Active View (Role Dashboard Home or Dedicated Subpage) */}
          {renderCurrentView()}

          {/* Bottom Institutional Accreditation Bar */}
          <footer className="pt-4 pb-2 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                Session Authenticated:{' '}
                <strong>{user?.id || MOCK_STUDENT_PROFILE.regNo}</strong> ({user?.name || MOCK_STUDENT_PROFILE.name})
              </span>
            </div>
            <span>© 2026 VIT-AP University. Central Academic & Student Administration.</span>
          </footer>
        </main>
      </div>

      {/* Accessible Global Modals */}

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAction={handleSelectSection}
        categories={navCategories}
      />

      <QuickFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};
