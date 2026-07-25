export interface AuthUser {
  id: string;
  email: string;
  phone?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  photo_url?: string;
  is_verified: boolean;
  expires_at?: string;
  roles: UserRoleClaim[];
  permissions: string[];
}

export interface UserRoleClaim {
  role_key: string;
  scope_type: string;
  scope_id: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenant_slug?: string;
}

export interface OtpRequest {
  phone: string;
  code: string;
  purpose: 'verification' | 'password_reset';
}
