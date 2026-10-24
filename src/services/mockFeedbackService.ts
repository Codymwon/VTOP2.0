import { PortalFeedbackItem } from '../types/feedback';

export const INITIAL_MOCK_FEEDBACK: PortalFeedbackItem[] = [
  {
    id: 'fb-101',
    userRegNo: '23BCE1088',
    userName: 'Arjun K Sharma',
    role: 'student',
    category: 'ui_bug',
    targetModule: 'Digital Assignments',
    rating: 4,
    title: 'Assignment upload status takes a second to reflect receipt badge',
    description: 'After uploading the DA-1 PDF, the verified receipt icon appeared after a minor delay on mobile viewport.',
    timestamp: '2026-09-12 11:20 AM',
    status: 'Under Review',
    adminNotes: 'Examining client-side state caching in AssignmentsPageView.',
    deviceInfo: 'Chrome 128 / Linux 64-bit',
  },
  {
    id: 'fb-102',
    userRegNo: '23BCE1402',
    userName: 'Priya Murugan',
    role: 'student',
    category: 'feature_request',
    targetModule: 'Examinations',
    rating: 5,
    title: 'Add seat number directly onto Exam Schedule table',
    description: 'It would be super helpful if the allocated desk and hall ticket reporting time are visible in the schedule tab directly.',
    timestamp: '2026-09-13 02:45 PM',
    status: 'Planned',
    adminNotes: 'Integrated in Fall 2026-27 examinations module rollout.',
    deviceInfo: 'Safari 17 / iOS 18',
  },
  {
    id: 'fb-103',
    userRegNo: 'EMP10245',
    userName: 'Dr. Hussain Syed',
    role: 'faculty',
    category: 'usability',
    targetModule: 'Continuous Assessment Marks',
    rating: 5,
    title: 'Clean separation between marks and letter grades is fantastic',
    description: 'Separating CAM weightage marks from final semester grades makes entering and verifying internal marks much clearer.',
    timestamp: '2026-09-14 09:15 AM',
    status: 'Resolved',
    adminNotes: 'Deployed across student and faculty portals.',
    deviceInfo: 'Edge 128 / Windows 11',
  },
  {
    id: 'fb-104',
    userRegNo: '22BCE2041',
    userName: 'Karthik Sundar',
    role: 'student',
    category: 'visual_glitch',
    targetModule: 'Attendance',
    rating: 4,
    title: 'Dark mode contrast for safe debar calculation badge',
    description: 'The green badge on safe classes to miss has high saturation on OLED screens.',
    timestamp: '2026-09-14 04:30 PM',
    status: 'New',
    deviceInfo: 'Firefox 130 / Android 14',
  },
];

let feedbackStore = [...INITIAL_MOCK_FEEDBACK];

export const getPortalFeedback = (): PortalFeedbackItem[] => {
  return [...feedbackStore];
};

export const addPortalFeedback = (
  item: Omit<PortalFeedbackItem, 'id' | 'timestamp' | 'status'>
): PortalFeedbackItem => {
  const newEntry: PortalFeedbackItem = {
    ...item,
    id: `fb-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
    status: 'New',
  };
  feedbackStore = [newEntry, ...feedbackStore];
  return newEntry;
};

export const updateFeedbackStatus = (
  id: string,
  status: PortalFeedbackItem['status'],
  adminNotes?: string
): void => {
  feedbackStore = feedbackStore.map((fb) =>
    fb.id === id ? { ...fb, status, ...(adminNotes ? { adminNotes } : {}) } : fb
  );
};
