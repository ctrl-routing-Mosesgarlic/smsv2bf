export type ScopeType =
  | 'tenant'
  | 'school_group'
  | 'school'
  | 'grade_level'
  | 'stream'
  | 'department'
  | 'year_group';

export interface Role {
  key: string;
  name: string;
  tier: RoleTier;
  description?: string;
}

export type RoleTier =
  | 'platform'
  | 'governance'
  | 'departmental'
  | 'teaching'
  | 'finance'
  | 'support_staff'
  | 'external'
  | 'student_parent';

export interface Permission {
  key: string;
  name: string;
  module: string;
  description?: string;
}

export interface UserRoleAssignment {
  user_id: string;
  role_key: string;
  scope_type: ScopeType;
  scope_id: string;
  assigned_by: string;
  expires_at?: string;
}
