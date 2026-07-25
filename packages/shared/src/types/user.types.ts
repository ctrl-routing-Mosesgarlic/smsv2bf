export interface User {
  id: string;
  email: string;
  phone?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender?: string;
  nationality?: string;
  id_number?: string;
  photo_url?: string;
  alternative_phone?: string;
  address?: string;
  county?: string;
  sub_county?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface UserProfile extends User {
  roles: UserRole[];
  attributes: UserAttribute[];
}

export interface UserRole {
  id: string;
  role_key: string;
  scope_type: string;
  scope_id: string;
  scope_name?: string;
  assigned_at: string;
  expires_at?: string;
}

export interface UserAttribute {
  key: string;
  value: string;
  type?: string;
}
