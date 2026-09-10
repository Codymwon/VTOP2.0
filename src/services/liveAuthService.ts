import { 
  LoginCredentials, 
  LoginResult, 
  VerifyOtpResult, 
  ResendOtpResult, 
  AuthSession 
} from '../types/auth';
import { IAuthService } from './authService';
import { mockAuthService } from './mockAuthService';

const LIVE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          return {
            status: 'INVALID_CREDENTIALS',
            message: 'Invalid Registration/Employee ID or Password.',
          };
        }
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.requiresOtp) {
        return {
          status: 'OTP_REQUIRED',
          message: data.message || 'Two-factor OTP required.',
          otpEmailMasked: data.maskedEmail,
          cooldownSeconds: data.cooldownSeconds || 180,
        };
      }

      return {
        status: 'SUCCESS',
        message: 'Authentication successful.',
        session: data.session,
      };
    } catch (err: unknown) {
      console.warn('[LiveAuthService] Backend server unreachable, falling back to mock service:', err);
      // Seamless fallback so the user can test the UI offline without jarring failures
      return await mockAuthService.login(credentials);
    }
  }

  public async verifyOtp(otp: string): Promise<VerifyOtpResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vtop/validateSecurityOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpCode: otp }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'SUCCESS') {
        return {
          status: 'SUCCESS',
          message: 'OTP verified successfully.',
          session: data.session,
        };
      } else if (data.status === 'EXPIRED') {
        return {
          status: 'EXPIRED_OTP',
          message: 'Security OTP has expired. Please resend.',
        };
      } else {
        return {
          status: 'INVALID_OTP',
          message: 'Incorrect security OTP.',
          attemptsRemaining: data.attemptsRemaining,
        };
      }
    } catch (err: unknown) {
      console.warn('[LiveAuthService] Backend unreachable during OTP, falling back to mock:', err);
      return await mockAuthService.verifyOtp(otp);
    }
  }

  public async resendOtp(): Promise<ResendOtpResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vtop/resendSecurityOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        status: data.status === 'SUCCESS' ? 'SUCCESS' : 'COOLDOWN_ACTIVE',
        message: data.message,
        cooldownSeconds: data.cooldownSeconds || 180,
      };
    } catch (err: unknown) {
      console.warn('[LiveAuthService] Backend unreachable during resend OTP, falling back to mock:', err);
      return await mockAuthService.resendOtp();
    }
  }

  public async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/vtop/logout`, { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    await mockAuthService.logout();
  }

  public getCurrentSession(): AuthSession | null {
    return mockAuthService.getCurrentSession();
  }
}

export const liveAuthService = new LiveAuthService();
