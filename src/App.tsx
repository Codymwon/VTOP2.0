import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PreLoginScreen } from './screens/PreLoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            Initializing VTOP 2.0 Gateway...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <DashboardScreen />;
  }

  return (
    <div className="min-h-[100dvh] lg:h-[100dvh] lg:overflow-hidden bg-slate-50">
      <PreLoginScreen />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
