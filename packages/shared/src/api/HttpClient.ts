import { ApiError } from '../types';

export class HttpClient {
  constructor(private baseUrl: string) {}

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const apiError: ApiError = {
        errorCode: errorBody.error_code || 'UNKNOWN_ERROR',
        message: errorBody.message || 'An unexpected error occurred',
        context: errorBody.context,
        status: response.status,
      };
      throw apiError;
    }

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
