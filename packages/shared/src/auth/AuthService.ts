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
