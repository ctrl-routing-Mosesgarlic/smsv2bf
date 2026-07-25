export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  logo_url?: string;
  is_active: boolean;
  subscription_status?: string;
  created_at: string;
}

export interface SchoolGroup {
  id: string;
  name: string;
  code: string;
  tenant_id: string;
  region?: string;
  is_active: boolean;
  school_count?: number;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  code: string;
  school_group_id?: string;
  tenant_id: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  type?: 'primary' | 'secondary' | 'mixed';
  student_count?: number;
  staff_count?: number;
}
