import { AuthUser } from '../types';

class AuthService {
  private user: AuthUser | null = null;

  setUser(user: AuthUser): void {
    this.user = user;
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  clearUser(): void {
    this.user = null;
  }

  // Cookie outlives the short-lived access token so proxy.ts keeps the session
  // routable; an expired token is renewed by HttpClient on the first 401.
  setToken(token: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `sanctum_token=${token}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }

  clearToken(): void {
    if (typeof document === 'undefined') return;
    document.cookie = 'sanctum_token=; Path=/; Max-Age=0; SameSite=Lax';
    document.cookie = 'sanctum_refresh=; Path=/; Max-Age=0; SameSite=Lax';
  }

  setRefreshToken(token: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `sanctum_refresh=${token}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }

  getRefreshToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/sanctum_refresh=([^;]+)/);
    return match ? (match[1] ?? null) : null;
  }

  hasToken(): boolean {
    if (typeof document === 'undefined') return false;
    return /sanctum_token=[^;]+/.test(document.cookie);
  }

  isAuthenticated(): boolean {
    return this.user !== null && this.user.is_verified;
  }

  hasRole(roleKey: string): boolean {
    if (!this.user) return false;
    return this.user.roles.some((r) => r.role_key === roleKey);
  }

  hasPermission(permissionKey: string): boolean {
    if (!this.user) return false;
    return this.user.permissions.includes(permissionKey);
  }
}

export const authService = new AuthService();
