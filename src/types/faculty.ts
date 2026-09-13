export interface FacultyKPIs {
  activeCoursesCount: number;
  totalCredits: number;
  totalStudentsEnrolled: number;
  pendingGradingCount: number;
  proctorAdviseesCount: number;
  academicAlertsCount: number;
}

export interface FacultyTodaySlot {
  id: string;
  courseCode: string;
  courseTitle: string;
  courseType: 'Theory' | 'Lab' | 'Embedded Theory' | 'Embedded Lab';
  slot: string;
  startTime: string;
  endTime: string;
  room: string;
  enrolledCount: number;
  status: 'ongoing' | 'upcoming' | 'completed';
  attendanceMarked: boolean;
  topic?: string;
}

export interface FacultyStudentAttendanceItem {
  regNo: string;
  name: string;
  program: string;
  attendedClasses: number;
  totalClasses: number;
  attendancePercentage: number;
  status: 'Present' | 'Absent' | 'On-Duty';
  remarks?: string;
}

export interface FacultyCourse {
  id: string;
  code: string;
  title: string;
  type: string;
  slot: string;
  venue: string;
  credits: number;
  enrolledCount: number;
  syllabusProgress: number; // percentage
  nextLectureTopic: string;
  averageAttendance: number;
  students: {
    regNo: string;
    name: string;
    program: string;
    attendanceRate: number;
    cat1Score?: number;
  }[];
}

export interface PendingGradingItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  assignmentTitle: string;
  componentType: 'DA-1' | 'DA-2' | 'CAT-1' | 'CAT-2' | 'FAT' | 'Lab Exercise';
  studentRegNo: string;
  studentName: string;
  submittedDate: string;
  dueDate: string;
  maxMarks: number;
  status: 'Pending' | 'Graded';
  score?: number;
  feedback?: string;
  fileDetails?: string;
}

export interface AdviseeLeaveRequest {
  id: string;
  studentRegNo: string;
  studentName: string;
  outingType: 'Weekend Outing' | 'General Leave' | 'Emergency Outing';
  placeOfVisit: string;
  fromDate: string;
  toDate: string;
  reason: string;
  parentContact: string;
  parentConsentVerified: boolean;
  status: 'Pending Mentor' | 'Accepted' | 'Rejected';
  mentorRemarks?: string;
}

export interface FacultyAdvisee {
  regNo: string;
  name: string;
  program: string;
  semester: string;
  cgpa: number;
  attendancePercentage: number;
  roomNo: string;
  hostelBlock: string;
  alertLevel: 'normal' | 'caution' | 'critical';
  parentContact: string;
  pendingLeaveRequests: AdviseeLeaveRequest[];
}

export interface InvigilationDuty {
  id: string;
  examType: 'Mid-Term Examinations (CAT)' | 'Final Assessment Test (FAT)' | 'Supplementary';
  date: string;
  session: 'Forenoon (10:00 AM - 11:30 AM)' | 'Afternoon (02:00 PM - 03:30 PM)';
  hall: string;
  courseCode: string;
  courseTitle: string;
  reportingTime: string;
  chiefSuperintendent: string;
  status: 'Upcoming' | 'Completed';
}

export interface FacultyDutyLeave {
  id: string;
  leaveType: 'On-Duty (Conference/Seminar)' | 'Casual Leave' | 'Medical Leave' | 'Academic Research';
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  status: 'Approved' | 'Pending Dean Review' | 'Rejected';
  substituteFaculty: string;
}
