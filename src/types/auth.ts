export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string; // Registration Number (e.g. 23BCE1088), Employee ID (e.g. EMP10245), or Admin ID (e.g. ADM1001)
  name: string;
  email: string;
  role: UserRole;
  school?: string;
  program?: string;
  semester?: string;
  designation?: string; // For faculty
  department?: string;
  campus: string;
  avatarUrl?: string;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
  authenticatedAt: string;
  expiresAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  role: UserRole;
  rememberMe?: boolean;
}

export interface LoginResult {
  status: 'SUCCESS' | 'OTP_REQUIRED' | 'INVALID_CREDENTIALS' | 'ERROR';
  message: string;
  session?: AuthSession;
  otpEmailMasked?: string;
  cooldownSeconds?: number;
}

export interface VerifyOtpResult {
  status: 'SUCCESS' | 'INVALID_OTP' | 'EXPIRED_OTP' | 'MAX_ATTEMPTS_EXCEEDED' | 'ERROR';
  message: string;
  session?: AuthSession;
  attemptsRemaining?: number;
}

export interface ResendOtpResult {
  status: 'SUCCESS' | 'COOLDOWN_ACTIVE' | 'ERROR';
  message: string;
  cooldownSeconds: number;
}

export interface CampusNotice {
  id: string;
  title: string;
  tag: 'Urgent' | 'Academic' | 'Alumni' | 'General';
  date: string;
  isNew?: boolean;
  link?: string;
}

export interface UniversityAccreditation {
  title: string;
  highlight: string;
  agency: string;
  year: string;
}
