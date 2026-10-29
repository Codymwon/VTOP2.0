import { 
  LoginCredentials, 
  LoginResult, 
  VerifyOtpResult, 
  ResendOtpResult, 
  AuthSession 
} from '../types/auth';
import { IAuthService } from './authService';
import { mockAuthService } from './mockAuthService';

const resolveApiBase = (): string => {
  if (typeof import.meta.env.VITE_API_BASE_URL === 'string') {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '3000') {
    return 'http://localhost:8080';
  }
  return '';
};

const LIVE_API_BASE_URL = resolveApiBase();
const LIVE_SESSION_KEY = 'vtop_live_session';

class LiveAuthService implements IAuthService {
  private baseUrl: string = LIVE_API_BASE_URL;

  public async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vtop/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          role: credentials.role,
          deliveryMethod: credentials.deliveryMethod,
          targetEmail: credentials.targetEmail,
          targetPhone: credentials.targetPhone,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return {
          status: 'INVALID_CREDENTIALS',
          message: errData.message || 'Invalid credentials or verification failed.',
        };
      }

      const data = await response.json();
      if (data.requiresOtp) {
        if (data.otpSessionId) {
          sessionStorage.setItem('vtop_otp_session_id', data.otpSessionId);
        }
        return {
          status: 'OTP_REQUIRED',
          message: data.message || 'Two-factor OTP required.',
          otpEmailMasked: data.destinationMasked || data.maskedEmail,
          destinationMasked: data.destinationMasked || data.maskedEmail,
          channel: data.channel,
          cooldownSeconds: data.cooldownSeconds || 180,
          devOtpHint: data.devOtpHint,
        };
      }

      if (data.session) {
        localStorage.setItem(LIVE_SESSION_KEY, JSON.stringify(data.session));
      }

      return {
        status: 'SUCCESS',
        message: 'Authentication successful.',
        session: data.session,
      };
    } catch (err: unknown) {
      console.error('[LiveAuthService] Backend server connection error:', err);
      return {
        status: 'ERROR',
        message: 'Cannot connect to backend server at http://localhost:8080. Please ensure "npm start" or "npm run server" is running.',
      };
    }
  }

  public async verifyOtp(otp: string): Promise<VerifyOtpResult> {
    try {
      const otpSessionId = sessionStorage.getItem('vtop_otp_session_id');
      const response = await fetch(`${this.baseUrl}/api/vtop/validateSecurityOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpCode: otp, otpSessionId }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (errData.status === 'EXPIRED') {
          return {
            status: 'EXPIRED_OTP',
            message: errData.message || 'Security OTP has expired. Please resend.',
          };
        }
        return {
          status: 'INVALID_OTP',
          message: errData.message || 'Incorrect security OTP.',
          attemptsRemaining: errData.attemptsRemaining,
        };
      }

      const data = await response.json();
      if (data.status === 'SUCCESS') {
        sessionStorage.removeItem('vtop_otp_session_id');
        if (data.session) {
          localStorage.setItem(LIVE_SESSION_KEY, JSON.stringify(data.session));
        }
        return {
          status: 'SUCCESS',
          message: 'OTP verified successfully.',
          session: data.session,
        };
      } else {
        return {
          status: 'INVALID_OTP',
          message: data.message || 'Incorrect security OTP.',
          attemptsRemaining: data.attemptsRemaining,
        };
      }
    } catch (err: unknown) {
      console.error('[LiveAuthService] Backend unreachable during OTP verification:', err);
      return {
        status: 'ERROR',
        message: 'Cannot reach backend server. Please verify backend is running on http://localhost:8080.',
      };
    }
  }

  public async resendOtp(): Promise<ResendOtpResult> {
    try {
      const otpSessionId = sessionStorage.getItem('vtop_otp_session_id');
      const response = await fetch(`${this.baseUrl}/api/vtop/resendSecurityOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpSessionId }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return {
          status: 'COOLDOWN_ACTIVE',
          message: errData.message || 'Cooldown active',
          cooldownSeconds: errData.cooldownSeconds || 180,
        };
      }

      const data = await response.json();
      return {
        status: data.status === 'SUCCESS' ? 'SUCCESS' : 'COOLDOWN_ACTIVE',
        message: data.message,
        cooldownSeconds: data.cooldownSeconds || 180,
        devOtpHint: data.devOtpHint,
      };
    } catch (err: unknown) {
      console.error('[LiveAuthService] Backend unreachable during resend OTP:', err);
      return {
        status: 'ERROR',
        message: 'Cannot reach backend server to resend OTP.',
        cooldownSeconds: 0,
      };
    }
  }

  public async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/vtop/logout`, { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem(LIVE_SESSION_KEY);
    sessionStorage.removeItem('vtop_otp_session_id');
    await mockAuthService.logout();
  }

  public getCurrentSession(): AuthSession | null {
    const raw = localStorage.getItem(LIVE_SESSION_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return mockAuthService.getCurrentSession();
  }
}

export const liveAuthService = new LiveAuthService();
