'use client';

import { createContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { API_ROUTES } from '@cbc/config/routes';
import type {
  ApiError,
  AuthUser,
  LoginMfaRequired,
  LoginSuccess,
  UserRoleClaim,
} from '../types';
import { authService } from './AuthService';
import { useHttpClient } from '../api/useHttpClient';

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roleKey: string) => boolean;
  hasPermission: (permissionKey: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface MeResponse {
  user_id: string;
  email: string;
  phone_number: string | null;
  email_verified: boolean;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  is_platform_staff: boolean;
  roles: UserRoleClaim[];
  permissions: string[];
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const httpClient = useHttpClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentUser = useCallback(
    async (expiresIn?: number): Promise<AuthUser> => {
      const { data } = await httpClient.get<{ data: MeResponse }>(API_ROUTES.me);
      return {
        id: data.user_id,
        email: data.email,
        phone: data.phone_number ?? undefined,
        first_name: data.first_name,
        middle_name: data.middle_name ?? undefined,
        last_name: data.last_name,
        is_verified: data.email_verified,
        expires_at: expiresIn
          ? new Date(Date.now() + expiresIn * 1000).toISOString()
          : undefined,
        roles: data.roles,
        permissions: data.permissions,
      };
    },
    [httpClient]
  );

  useEffect(() => {
    if (!authService.hasToken()) return;
    let cancelled = false;
    setIsLoading(true);
    fetchCurrentUser()
      .then((u) => {
        if (cancelled) return;
        setUser(u);
        authService.setUser(u);
      })
      .catch(() => {
        if (cancelled) return;
        authService.clearToken();
        authService.clearUser();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchCurrentUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await httpClient.post<LoginSuccess | LoginMfaRequired>(
          API_ROUTES.login,
          { identifier: email, password }
        );
        if ('mfa_required' in response) {
          const mfaError: ApiError = {
            errorCode: 'MFA_REQUIRED',
            message: response.message,
            context: { mfa_token: response.mfa_token },
            status: 200,
          };
          throw mfaError;
        }

        const { access_token, refresh_token, expires_in } = response.data;
        authService.setToken(access_token);
        authService.setRefreshToken(refresh_token);

        const authUser = await fetchCurrentUser(expires_in);
        setUser(authUser);
        authService.setUser(authUser);
      } finally {
        setIsLoading(false);
      }
    },
    [httpClient, fetchCurrentUser]
  );

  const logout = useCallback(async () => {
    try {
      await httpClient.post(API_ROUTES.logout);
    } finally {
      setUser(null);
      authService.clearUser();
      authService.clearToken();
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
