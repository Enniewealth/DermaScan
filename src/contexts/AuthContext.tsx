// ============================================
// DermaScan — Auth Context
// ============================================

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  isProcessing: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const isLoading = isInitializing || isProcessing;

  // Initialize auth session on load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('dermascan_token');
      if (token) {
        try {
          const userProfile = await api.get<User>('/users/me', 3000);
          setUser(userProfile);
          localStorage.setItem('dermascan_cached_user', JSON.stringify(userProfile));
        } catch (err: any) {
          console.error('Session restore failed, using cache:', err.message);
          const isNetworkError = !navigator.onLine ||
                                 err.message?.includes('Failed to fetch') ||
                                 err.message?.includes('timeout') ||
                                 err.message?.includes('Network') ||
                                 err.message?.includes('Unable to connect');
          if (isNetworkError) {
            const cachedUser = localStorage.getItem('dermascan_cached_user');
            if (cachedUser) {
              setUser(JSON.parse(cachedUser));
            } else {
              setUser({
                id: 'offline_user',
                fullName: 'Eniolami',
                email: 'offline@dermascan.ai',
                primarySkinConcern: 'General Care',
                settings: {
                  language: 'EN',
                  scanReminders: true,
                  privacyMode: false
                },
                createdAt: new Date().toISOString()
              });
            }
          } else {
            localStorage.removeItem('dermascan_token');
            localStorage.removeItem('dermascan_cached_user');
          }
        }
      }
      setIsInitializing(false);
    };
    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsProcessing(true);
    try {
      const data = await api.post<{ accessToken: string; tokenType: string; userId: string }>('/auth/login', { email, password }, 20000);
      localStorage.setItem('dermascan_token', data.accessToken);
      const userProfile = await api.get<User>('/users/me');
      setUser(userProfile);
      localStorage.setItem('dermascan_cached_user', JSON.stringify(userProfile));
    } catch (err) {
      localStorage.removeItem('dermascan_token');
      localStorage.removeItem('dermascan_cached_user');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const signup = useCallback(async (fullName: string, email: string, password: string) => {
    setIsProcessing(true);
    try {
      const data = await api.post<{ accessToken: string; tokenType: string; userId: string }>('/auth/signup', { fullName, email, password }, 20000);
      localStorage.setItem('dermascan_token', data.accessToken);
      const userProfile = await api.get<User>('/users/me');
      setUser(userProfile);
      localStorage.setItem('dermascan_cached_user', JSON.stringify(userProfile));
    } catch (err) {
      localStorage.removeItem('dermascan_token');
      localStorage.removeItem('dermascan_cached_user');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('dermascan_token');
    localStorage.removeItem('dermascan_cached_user');
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    try {
      if (updates.settings) {
        const updatedSettings = await api.put<User['settings']>('/users/me/settings', updates.settings);
        setUser((prev) => {
          if (!prev) return prev;
          return { ...prev, settings: updatedSettings };
        });
      } else {
        const updatedUser = await api.put<User>('/users/me', updates);
        setUser(updatedUser);
      }
    } catch (err) {
      console.error('Failed to update profile details on server:', err);
      throw err;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isInitializing,
        isProcessing,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
