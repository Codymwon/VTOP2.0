import React from 'react';
import {
  MOCK_ACADEMIC_KPIS,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_TODAY_SCHEDULE,
  MOCK_DIGITAL_ASSIGNMENTS,
  MOCK_SPOTLIGHT_ALERT,
} from '../../../services/mockDashboardService';
import { SpotlightBanner } from '../SpotlightBanner';
import { VitalsSummaryCards } from '../VitalsSummaryCards';
import { TodayScheduleWidget } from '../TodayScheduleWidget';
import { AttendancePulseWidget } from '../AttendancePulseWidget';
import { UpcomingTasksWidget } from '../UpcomingTasksWidget';
import { QuickActionsBar } from '../QuickActionsBar';

interface StudentDashboardViewProps {
  onNavigateTo: (sectionId: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ onNavigateTo }) => {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Urgent Spotlight & COE Assessment Alert */}
      <SpotlightBanner alert={MOCK_SPOTLIGHT_ALERT} />

      {/* 2. Academic Vitals Strip (4 KPI Cards) */}
      <VitalsSummaryCards
        kpis={MOCK_ACADEMIC_KPIS}
        onNavigateToAttendance={() => onNavigateTo('attendance')}
        onNavigateToGrades={() => onNavigateTo('gradehistory')}
        onNavigateToCourses={() => onNavigateTo('timetable')}
      />

      {/* 3. Multi-Column Cockpit Layout (60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column: Schedule & Quick Actions (7 cols on lg = ~58%) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          <TodayScheduleWidget
            schedule={MOCK_TODAY_SCHEDULE}
            onOpenFullTimetable={() => onNavigateTo('timetable')}
          />

          <QuickActionsBar
            onOpenTimetable={() => onNavigateTo('timetable')}
            onOpenOuting={() => onNavigateTo('hostelouting')}
            onOpenGrades={() => onNavigateTo('grades')}
            onOpenReceipts={() => onNavigateTo('payments')}
            onOpenCoursePage={() => onNavigateTo('timetable')}
          />
        </div>

        {/* Right Column: Attendance Margin & Upcoming Tasks (5 cols on lg = ~42%) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          <AttendancePulseWidget
            records={MOCK_ATTENDANCE_RECORDS}
            onOpenFullAttendance={() => onNavigateTo('attendance')}
          />

          <UpcomingTasksWidget
            assignments={MOCK_DIGITAL_ASSIGNMENTS}
            onOpenAssignments={() => onNavigateTo('assignments')}
          />
        </div>
      </div>
    </div>
  );
};
