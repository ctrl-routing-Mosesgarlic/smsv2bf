export interface TenantContext {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  domain: string;
  plan_name?: string;
  is_active: boolean;
}

export interface SchoolContext {
  id: string;
  name: string;
  slug: string;
  code: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  tenant_id: string;
}

export interface AppContextValue {
  tenant: TenantContext | null;
  school: SchoolContext | null;
}
