export interface AdminCampusKPIs {
  campusHeadcountTotal: number;
  studentsOnCampus: number;
  studentsOutOnPass: number;
  pendingOutingReviews: number;
  facultyPresentCount: number;
  facultyTotalCount: number;
  facultyAttendanceRate: number;
  pendingFeeClearances: number;
  activeTurnstiles: number;
}

export interface AdminOutingRequest {
  id: string;
  studentRegNo: string;
  studentName: string;
  gender: string;
  hostelBlock: string;
  roomNo: string;
  outingType: 'Weekend Outing' | 'General Leave' | 'Emergency Outing';
  placeOfVisit: string;
  fromDate: string;
  toDate: string;
  purpose: string;
  parentConsentVerified: boolean;
  parentPhone: string;
  mentorApproved: boolean;
  mentorName: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  requestedAt: string;
  decisionTimestamp?: string;
  remarks?: string;
}

export interface EmergencyCircular {
  id: string;
  title: string;
  summary: string;
  content: string;
  targetAudience: 'All University' | 'All Students' | 'All Faculty' | 'Hostellers Only';
  priority: 'Emergency' | 'Urgent' | 'Info';
  publishedAt: string;
  publishedBy: string;
  isActive: boolean;
  acknowledgedCount?: number;
}

export interface GatePassSwipe {
  id: string;
  timestamp: string;
  studentRegNo: string;
  studentName: string;
  hostelBlock: string;
  direction: 'IN' | 'OUT';
  gate: string; // e.g. "Main Gate Turnstile 02", "Hostel Block A Gate"
  verifiedBy: string; // e.g. "Biometric Face Recognition", "RFID Security Desk"
  status: 'Authorized' | 'Flagged';
  passId?: string;
}

export interface AcademicAllocation {
  courseCode: string;
  courseTitle: string;
  department: string;
  facultyAssigned: string;
  slot: string;
  room: string;
  block: 'Central Block (CB)' | 'Academic Block 1 (AB-1)' | 'Academic Block 2 (AB-2)';
  capacity: number;
  enrolled: number;
  occupancyRate: number;
}

export interface FeeClearanceAuditItem {
  id: string;
  studentRegNo: string;
  studentName: string;
  program: string;
  semester: string;
  feeType: 'Tuition Fee' | 'Hostel & Mess' | 'Special Lab Fee' | 'Late Fee Penalty';
  totalDue: number;
  paidAmount: number;
  balanceAmount: number;
  clearanceStatus: 'Clear' | 'Pending Review' | 'Defaulter';
  hallTicketEligible: boolean;
  paymentMode?: string;
  lastPaymentDate?: string;
}

export interface UserDirectoryItem {
  id: string;
  name: string;
  role: 'student' | 'faculty' | 'staff' | 'admin';
  email: string;
  phone: string;
  departmentOrSchool: string;
  designationOrDegree: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  biometricId: string;
  lastLogin: string;
}
