import { API_ROUTES } from '@cbc/config/routes';
import { ApiError } from '../types';
import { authService } from '../auth/AuthService';

const NO_REFRESH_PATHS: string[] = [API_ROUTES.login, API_ROUTES.refresh, API_ROUTES.logout, API_ROUTES.forgotPassword, API_ROUTES.otpVerify];


export class HttpClient {
  private refreshing: Promise<boolean> | null = null;

  constructor(private baseUrl: string) {}

  private refreshSession(): Promise<boolean> {
    this.refreshing ??= this.doRefresh().finally(() => {
      this.refreshing = null;
    });
    return this.refreshing;
  }

  private async doRefresh(): Promise<boolean> {
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${this.baseUrl}${API_ROUTES.refresh}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) return false;
      const { data } = await res.json();
      authService.setToken(data.access_token);
      authService.setRefreshToken(data.refresh_token);
      return true;
    } catch {
      return false;
    }
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestInit,
    retried = false
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const { headers: extraHeaders, ...rest } = options ?? {};
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(extraHeaders as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...rest,
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && !retried && !NO_REFRESH_PATHS.includes(path)) {
      if (await this.refreshSession()) {
        return this.request<T>(method, path, body, options, true);
      }
      authService.clearToken();
      authService.clearUser();
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const apiError: ApiError = {
        errorCode: errorBody.error_code || errorBody.error || 'UNKNOWN_ERROR',
        message: errorBody.message || 'An unexpected error occurred',
        context: errorBody.context ?? errorBody.errors,
        status: response.status,
      };
      throw apiError;
    }

    if (response.status === 204) return undefined as T;
    return response.json();
  }

  get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const match = document.cookie.match(/sanctum_token=([^;]+)/);
    return match ? (match[1] ?? null) : null;
  }
}
