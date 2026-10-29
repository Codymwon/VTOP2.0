import { 
  LoginCredentials, 
  LoginResult, 
  VerifyOtpResult, 
  ResendOtpResult, 
  AuthSession, 
  UserProfile 
} from '../types/auth';

const SESSION_STORAGE_KEY = 'vtop_mock_session';
const OTP_SIMULATION_FLAG_KEY = 'vtop_mock_simulate_otp';

class MockAuthService {
  private activeOtp: string | null = null;
  private otpExpiresAt: number = 0;
  private otpAttempts: number = 0;
  private lastResendTimestamp: number = 0;
  private pendingUser: UserProfile | null = null;
  private maxAttempts = 4;
  private cooldownDuration = 180;

  public setSimulateOtp(enabled: boolean) {
    localStorage.setItem(OTP_SIMULATION_FLAG_KEY, enabled ? 'true' : 'false');
  }

  public shouldSimulateOtp(): boolean {
    const val = localStorage.getItem(OTP_SIMULATION_FLAG_KEY);
    return val === null ? true : val === 'true';
  }

  public async login(credentials: LoginCredentials): Promise<LoginResult> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const username = credentials.username.trim().toUpperCase();
    const password = credentials.password;

    if (!username || !password) {
      return {
        status: 'INVALID_CREDENTIALS',
        message: 'Please enter both User ID and Password.',
      };
    }

    let user: UserProfile;
    if (credentials.role === 'student') {
      user = {
        id: username.startsWith('2') ? username : '23MIC7209',
        name: 'Akarsh',
        email: 'akarsh.23mic7209@vitapstudent.ac.in',
        phone: '+91 98401 23456',
        role: 'student',
        school: 'School of Computer Science & Engineering (SCOPE)',
        program: 'Integrated M.Tech - Computer Science and Engineering',
        semester: 'Fall Semester 2026-27',
        campus: 'VIT-AP University, Amaravati',
      };

      if (credentials.targetEmail && !credentials.targetEmail.toLowerCase().endsWith('@vitapstudent.ac.in')) {
        return {
          status: 'INVALID_CREDENTIALS',
          message: 'Student institutional email must end with @vitapstudent.ac.in',
        };
      }
    } else if (credentials.role === 'faculty') {
      user = {
        id: username.startsWith('EMP') ? username : 'EMP10245',
        name: 'Dr. Hussain Syed',
        email: 'hussain.syed@vitap.ac.in',
        phone: '+91 94432 10987',
        role: 'faculty',
        department: 'Department of Software and Systems Engineering',
        designation: 'Professor & Head of UI/UX Research Lab',
        campus: 'VIT-AP University, Amaravati',
      };

      if (credentials.targetEmail && !credentials.targetEmail.toLowerCase().endsWith('@vitap.ac.in')) {
        return {
          status: 'INVALID_CREDENTIALS',
          message: 'Faculty institutional email must end with @vitap.ac.in',
        };
      }
    } else {
      user = {
        id: username.startsWith('ADM') ? username : 'ADM1001',
        name: 'Dr. S. K. Narayanan',
        email: 'sk.narayanan@vitap.ac.in',
        phone: '+91 98765 43210',
        role: 'admin',
        department: 'Office of Academic Administration & Security Operations',
        designation: 'Chief Administrative Officer & Registrar',
        campus: 'VIT-AP University, Amaravati',
      };
    }

    const channel = (credentials.deliveryMethod === 'sms' || credentials.targetPhone) ? 'SMS' : 'EMAIL';

    // Verify phone if SMS
    if (channel === 'SMS' && credentials.targetPhone) {
      const entered = credentials.targetPhone.replace(/[\s\-\(\)]/g, '');
      const registered = (user.phone || '').replace(/[\s\-\(\)]/g, '');
      if (entered !== registered && !registered.endsWith(entered)) {
        return {
          status: 'INVALID_CREDENTIALS',
          message: 'Entered mobile number does not match your registered institutional number on record.',
        };
      }
    }

    if (this.shouldSimulateOtp()) {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      this.activeOtp = generatedOtp;
      this.otpExpiresAt = Date.now() + 10 * 60 * 1000;
      this.otpAttempts = 0;
      this.lastResendTimestamp = Date.now();
      this.pendingUser = user;

      const masked = channel === 'EMAIL'
        ? `${user.email.slice(0, 3)}***@${user.email.split('@')[1]}`
        : `${user.phone?.slice(0, 3)}******${user.phone?.slice(-4)}`;

      return {
        status: 'OTP_REQUIRED',
        message: channel === 'EMAIL'
          ? `Security OTP sent to registered institutional email.`
          : `Security OTP sent via SMS to registered mobile number.`,
        channel,
        otpEmailMasked: masked,
        destinationMasked: masked,
        cooldownSeconds: this.cooldownDuration,
        devOtpHint: generatedOtp,
      };
    }

    const session = this.createSession(user);
    return {
      status: 'SUCCESS',
      message: 'Authentication successful.',
      session,
    };
  }

  public async verifyOtp(otp: string): Promise<VerifyOtpResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!this.pendingUser) {
      return {
        status: 'ERROR',
        message: 'No pending authentication session found. Please enter your credentials again.',
      };
    }

    if (Date.now() > this.otpExpiresAt) {
      return {
        status: 'EXPIRED_OTP',
        message: 'OTP has expired. Please click Resend OTP.',
      };
    }

    this.otpAttempts += 1;

    if (otp === this.activeOtp || otp === '123456') {
      const session = this.createSession(this.pendingUser);
      this.pendingUser = null;
      this.activeOtp = null;
      return {
        status: 'SUCCESS',
        message: 'Security credentials verified successfully.',
        session,
      };
    }

    const attemptsRemaining = Math.max(0, this.maxAttempts - this.otpAttempts);
    if (attemptsRemaining === 0) {
      this.pendingUser = null;
      this.activeOtp = null;
      return {
        status: 'MAX_ATTEMPTS_EXCEEDED',
        message: 'Maximum verification attempts exceeded. Account locked for 15 minutes.',
        attemptsRemaining: 0,
      };
    }

    return {
      status: 'INVALID_OTP',
      message: 'Incorrect security OTP.',
      attemptsRemaining,
    };
  }

  public async resendOtp(): Promise<ResendOtpResult> {
    const elapsedSeconds = Math.floor((Date.now() - this.lastResendTimestamp) / 1000);

    if (elapsedSeconds < this.cooldownDuration) {
      return {
        status: 'COOLDOWN_ACTIVE',
        message: `Please wait before requesting a new OTP.`,
        cooldownSeconds: this.cooldownDuration - elapsedSeconds,
      };
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    this.activeOtp = generatedOtp;
    this.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    this.lastResendTimestamp = Date.now();
    this.otpAttempts = 0;

    return {
      status: 'SUCCESS',
      message: 'A fresh security OTP has been dispatched.',
      cooldownSeconds: this.cooldownDuration,
      devOtpHint: generatedOtp,
    };
  }

  public async logout(): Promise<void> {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.pendingUser = null;
    this.activeOtp = null;
  }

  public getCurrentSession(): AuthSession | null {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!saved) return null;
    try {
      const session: AuthSession = JSON.parse(saved);
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  private createSession(user: UserProfile): AuthSession {
    const now = new Date();
    const expires = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    const session: AuthSession = {
      token: `mock_jwt_token_${user.id}_${Date.now()}`,
      user,
      authenticatedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  }
}

export const mockAuthService = new MockAuthService();
