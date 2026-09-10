export interface StudentProfile {
  name: string;
  regNo: string;
  applicationNo: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  nativeLanguage: string;
  nativeState: string;
  degree: string;
  program: string;
  school: string;
  semester: string;
  admissionYear: number;
  isHosteller: boolean;
  hostelBlock: string;
  roomNo: string;
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  education: {
    schoolName: string;
    board: string;
    qualification: string;
    percentage: string;
    yearOfPassing: string;
  };
  avatarUrl?: string;
}

export interface AcademicKPIs {
  overallAttendancePercentage: number;
  totalAttendedClasses: number;
  totalConductedClasses: number;
  debarSafetyStatus: 'safe' | 'caution' | 'critical';
  cgpa: number;
  totalEarnedCredits: number;
  currentSemesterCredits: number;
  enrolledSubjectsCount: number;
  enrolledComponentsCount: number;
}

export interface TodayClassSlot {
  id: string;
  courseCode: string;
  courseTitle: string;
  courseType: 'Theory' | 'Lab' | 'Embedded Theory' | 'Embedded Lab' | 'Embedded Project';
  slot: string;
  venue: string;
  facultyName: string;
  facultySchool: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export interface AttendanceDayLog {
  slNo: number;
  date: string;
  slot: string;
  dayTime: string;
  status: 'Present' | 'Absent';
  remark?: string;
}

export interface AttendanceRecord {
  id: string;
  courseCode: string;
  courseTitle: string;
  courseType: string;
  slot: string;
  venue: string;
  facultyName: string;
  facultySchool: string;
  attendedClasses: number;
  totalClasses: number;
  attendancePercentage: number;
  debarStatus: 'Clear' | 'Debarred';
  safeClassesToMiss: number;
  classesNeededFor75: number;
  dayLogs?: AttendanceDayLog[];
}

export interface AssessmentMarkItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  courseType: string;
  slot: string;
  facultyName: string;
  title: string;
  maxMarks: number;
  weightage: number;
  status: 'Present' | 'Absent';
  scoredMark: number;
  weightageMark: number;
  remark?: string;
}

export interface GradeItem {
  courseCode: string;
  courseTitle: string;
  courseType: string;
  credits: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'P';
  marksScored?: number;
  examMonth: string;
}

export interface DigitalAssignmentItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  maxMarks: number;
  weightage: number;
  dueDate: string;
  status: 'Pending' | 'Uploaded' | 'Graded';
  daysRemaining: number;
  fileDetails?: string;
}

export interface OutingRecord {
  id: string;
  placeOfVisit: string;
  purpose: string;
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  status: 'Leave Request Accepted' | 'Pending Mentor Approval' | 'Mentor Rejected Request';
  outPassAvailable: boolean;
  mentorRemark?: string;
  outingType?: 'weekend' | 'general';
}

export interface OutingSummary {
  hostelBlock: string;
  roomNo: string;
  activeRequest?: {
    id: string;
    type: 'General Leave' | 'Weekend Outing';
    placeOfVisit: string;
    fromDate: string;
    toDate: string;
    status: 'Accepted' | 'Pending Mentor' | 'Pending Warden' | 'Rejected';
  };
}

export interface SpotlightAlert {
  id: string;
  tag: string;
  category: string;
  title: string;
  url: string;
  isUrgent: boolean;
  expiresText?: string;
}

export interface NavCategory {
  id: string;
  label: string;
  iconName: string;
  badge?: string;
  items: {
    id: string;
    label: string;
    href?: string;
    isExternal?: boolean;
    badge?: string;
  }[];
}
