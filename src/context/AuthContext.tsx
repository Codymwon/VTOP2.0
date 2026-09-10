import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AuthSession, 
  UserProfile, 
  LoginCredentials, 
  LoginResult, 
  VerifyOtpResult, 
  ResendOtpResult 
} from '../types/auth';
import { 
  ApiMode, 
  getStoredApiMode, 
  setStoredApiMode, 
  getAuthService 
} from '../services/authService';
import { mockAuthService } from '../services/mockAuthService';

interface AuthContextType {
  user: UserProfile | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  apiMode: ApiMode;
  simulateOtp: boolean;
  setApiMode: (mode: ApiMode) => void;
  setSimulateOtp: (enabled: boolean) => void;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  verifyOtp: (otp: string) => Promise<VerifyOtpResult>;
  resendOtp: () => Promise<ResendOtpResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiMode, setApiModeState] = useState<ApiMode>(getStoredApiMode());
  const [simulateOtp, setSimulateOtpState] = useState<boolean>(mockAuthService.shouldSimulateOtp());

  useEffect(() => {
    const service = getAuthService(apiMode);
    const existing = service.getCurrentSession();
    if (existing) {
      setSession(existing);
    }
    setIsLoading(false);
  }, [apiMode]);

  const handleSetApiMode = (mode: ApiMode) => {
    setStoredApiMode(mode);
    setApiModeState(mode);
  };

  const handleSetSimulateOtp = (enabled: boolean) => {
    mockAuthService.setSimulateOtp(enabled);
    setSimulateOtpState(enabled);
  };

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    const service = getAuthService(apiMode);
    const result = await service.login(credentials);
    if (result.status === 'SUCCESS' && result.session) {
      setSession(result.session);
    }
    return result;
  };

  const verifyOtp = async (otp: string): Promise<VerifyOtpResult> => {
    const service = getAuthService(apiMode);
    const result = await service.verifyOtp(otp);
    if (result.status === 'SUCCESS' && result.session) {
      setSession(result.session);
    }
    return result;
  };

  const resendOtp = async (): Promise<ResendOtpResult> => {
    const service = getAuthService(apiMode);
    return await service.resendOtp();
  };

  const logout = async (): Promise<void> => {
    const service = getAuthService(apiMode);
    await service.logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        session,
        isAuthenticated: !!session,
        isLoading,
        apiMode,
        simulateOtp,
        setApiMode: handleSetApiMode,
        setSimulateOtp: handleSetSimulateOtp,
        login,
        verifyOtp,
        resendOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
