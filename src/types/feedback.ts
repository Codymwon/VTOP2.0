export type FeedbackCategory =
  | 'ui_bug'
  | 'visual_glitch'
  | 'feature_request'
  | 'performance'
  | 'usability'
  | 'general';

export type FeedbackStatus = 'New' | 'Under Review' | 'Planned' | 'Resolved';

export interface PortalFeedbackItem {
  id: string;
  userRegNo: string;
  userName: string;
  role: 'student' | 'faculty' | 'admin';
  category: FeedbackCategory;
  targetModule: string;
  rating: number; // 1 to 5
  title: string;
  description: string;
  timestamp: string;
  status: FeedbackStatus;
  adminNotes?: string;
  deviceInfo?: string;
}
