import { LoginCredentials, LoginResult, VerifyOtpResult, ResendOtpResult, AuthSession } from '../types/auth';
import { mockAuthService } from './mockAuthService';
import { liveAuthService } from './liveAuthService';

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<LoginResult>;
  verifyOtp(otp: string): Promise<VerifyOtpResult>;
  resendOtp(): Promise<ResendOtpResult>;
  logout(): Promise<void>;
  getCurrentSession(): AuthSession | null;
}

export type ApiMode = 'mock' | 'live';

const API_MODE_KEY = 'vtop_api_mode';

export function getStoredApiMode(): ApiMode {
  const saved = localStorage.getItem(API_MODE_KEY);
  return (saved === 'live') ? 'live' : 'mock'; // Default to 'mock' for offline resilience
}

export function setStoredApiMode(mode: ApiMode): void {
  localStorage.setItem(API_MODE_KEY, mode);
}

export function getAuthService(mode: ApiMode = getStoredApiMode()): IAuthService {
  return mode === 'live' ? liveAuthService : mockAuthService;
}
