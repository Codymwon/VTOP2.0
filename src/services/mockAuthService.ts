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
  private cooldownDuration = 180; // 3 minutes matching Rust backend

  // Helper to toggle OTP simulation on/off for testing convenience
  public setSimulateOtp(enabled: boolean) {
    localStorage.setItem(OTP_SIMULATION_FLAG_KEY, enabled ? 'true' : 'false');
  }

  public shouldSimulateOtp(): boolean {
    const val = localStorage.getItem(OTP_SIMULATION_FLAG_KEY);
    return val === null ? true : val === 'true'; // Default true for demonstration of 2FA flow
  }

  public async login(credentials: LoginCredentials): Promise<LoginResult> {
    // Artificial realistic network delay (500ms)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const username = credentials.username.trim().toUpperCase();
    const password = credentials.password;

    if (!username || !password) {
      return {
        status: 'INVALID_CREDENTIALS',
        message: 'Please enter both User ID and Password.',
      };
    }

    // Determine target profile
    let user: UserProfile;
    if (credentials.role === 'student') {
      user = {
        id: username.startsWith('2') ? username : '23BCE1088',
        name: 'Arjun K Sharma',
        email: `${username.toLowerCase()}@vitap.ac.in`,
        role: 'student',
        school: 'School of Computer Science & Engineering (SCOPE)',
        program: 'B.Tech Computer Science and Engineering',
        semester: 'Fall Semester 2026-27',
        campus: 'VIT-AP University, Amaravati',
        avatarUrl: undefined,
      };
    } else if (credentials.role === 'faculty') {
      user = {
        id: username.startsWith('EMP') ? username : 'EMP10245',
        name: 'Dr. Hussain Syed',
        email: `${username.toLowerCase()}@vitap.ac.in`,
        role: 'faculty',
        department: 'Department of Software and Systems Engineering',
        designation: 'Professor & Head of UI/UX Research Lab',
        campus: 'VIT-AP University, Amaravati',
      };
    } else {
      user = {
        id: username.startsWith('ADM') ? username : 'ADM1001',
        name: 'Dr. S. K. Narayanan',
        email: `${username.toLowerCase()}@vitap.ac.in`,
        role: 'admin',
        department: 'Office of the Registrar & Central Operations',
        designation: 'Chief Administrative Officer & Registrar',
        campus: 'VIT-AP University, Amaravati',
      };
    }

    // Check if test password is valid
    // For ease of evaluation, allow "password123", "vitap", or any password of length >= 6
    if (password.length < 4) {
      return {
        status: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Password must be at least 4 characters.',
      };
    }

    // Check if OTP simulation is required
    if (this.shouldSimulateOtp()) {
      this.pendingUser = user;
      this.activeOtp = '123456'; // Standard mock OTP, easy to type and test
      this.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
      this.otpAttempts = 0;
      this.lastResendTimestamp = Date.now();

      const maskedEmail = user.email.replace(/(.{2})(.*)(?=@)/, (_gp1, h, t) => h + '*'.repeat(t.length));

      return {
        status: 'OTP_REQUIRED',
        message: `Security OTP sent to your registered institutional email.`,
        otpEmailMasked: maskedEmail,
        cooldownSeconds: this.cooldownDuration,
      };
    }

    // Direct Login Path (Known device / trusted IP)
    const session = this.createSession(user);
    return {
      status: 'SUCCESS',
      message: 'Authentication successful. Redirecting to your dashboard...',
      session,
    };
  }

  public async verifyOtp(otp: string): Promise<VerifyOtpResult> {
    await new Promise((resolve) => setTimeout(resolve, 400));

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

    // Accept either the generated mock OTP or '123456'
    if (otp === this.activeOtp || otp === '123456') {
      const session = this.createSession(this.pendingUser);
      this.pendingUser = null;
      this.activeOtp = null;
      this.otpAttempts = 0;
      return {
        status: 'SUCCESS',
        message: 'OTP verified successfully.',
        session,
      };
    }

    const attemptsRemaining = Math.max(0, this.maxAttempts - this.otpAttempts);
    if (attemptsRemaining === 0) {
      this.pendingUser = null;
      this.activeOtp = null;
      return {
        status: 'MAX_ATTEMPTS_EXCEEDED',
        message: 'Maximum verification attempts (4) exceeded. Login session terminated for security.',
        attemptsRemaining: 0,
      };
    }

    return {
      status: 'INVALID_OTP',
      message: `Incorrect OTP. Please check your email and try again.`,
      attemptsRemaining,
    };
  }

  public async resendOtp(): Promise<ResendOtpResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - this.lastResendTimestamp) / 1000);

    if (elapsedSeconds < this.cooldownDuration) {
      return {
        status: 'COOLDOWN_ACTIVE',
        message: `Please wait before requesting another OTP.`,
        cooldownSeconds: this.cooldownDuration - elapsedSeconds,
      };
    }

    // Refresh OTP
    this.activeOtp = '123456';
    this.otpExpiresAt = now + 10 * 60 * 1000;
    this.lastResendTimestamp = now;
    this.otpAttempts = 0;

    return {
      status: 'SUCCESS',
      message: 'New OTP dispatched successfully to your registered university email.',
      cooldownSeconds: this.cooldownDuration,
    };
  }

  public async logout(): Promise<void> {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.pendingUser = null;
    this.activeOtp = null;
  }

  public getCurrentSession(): AuthSession | null {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    try {
      const session: AuthSession = JSON.parse(raw);
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  private createSession(user: UserProfile): AuthSession {
    const session: AuthSession = {
      token: `mock_jwt_${Math.random().toString(36).substring(2)}_${Date.now()}`,
      user,
      authenticatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  }
}

export const mockAuthService = new MockAuthService();
