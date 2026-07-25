'use client';

import { createContext, ReactNode, useState, useCallback } from 'react';
import { API_ROUTES } from '@cbc/config/routes';
import { AuthUser } from '../types';
import { authService } from './AuthService';
import { useHttpClient } from '../api/useHttpClient';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roleKey: string) => boolean;
  hasPermission: (permissionKey: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const httpClient = useHttpClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await httpClient.post<{ data: AuthUser }>(
          API_ROUTES.login,
          { email, password }
        );
        setUser(response.data);
        authService.setUser(response.data);
      } finally {
        setIsLoading(false);
      }
    },
    [httpClient]
  );

  const logout = useCallback(async () => {
    try {
      await httpClient.post(API_ROUTES.logout);
    } finally {
      setUser(null);
      authService.clearUser();
    }
  }, [httpClient]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null && user.is_verified,
    isLoading,
    login,
    logout,
    hasRole: (roleKey: string) => authService.hasRole(roleKey),
    hasPermission: (permissionKey: string) =>
      authService.hasPermission(permissionKey),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
