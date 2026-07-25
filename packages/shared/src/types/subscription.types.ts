export type PlanCode = 'basic' | 'standard' | 'premium' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  plan_id: string;
  plan_code: PlanCode;
  plan_name: string;
  billing_cycle: BillingCycle;
  price: number;
  currency: string;
  max_schools: number;
  max_users: number;
  max_students: number;
  max_teachers: number;
  max_storage_mb: number;
  is_active: boolean;
  features?: PlanFeatureAssignment[];
}

export interface PlanFeatureAssignment {
  feature_code: string;
  feature_name: string;
  feature_category: string | null;
  description: string | null;
  value_type: 'boolean' | 'integer' | 'text';
  is_enabled: boolean;
  feature_value: string | null;
}

export interface TenantSubscription {
  subscription_id: string;
  tenant_id: string;
  plan_id: string;
  subscription_status: 'trial' | 'active' | 'suspended' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string | null;
  trial_ends_at: string | null;
  next_billing_date: string | null;
  auto_renew: boolean;
  plan_name?: string;
  plan_code?: PlanCode;
  features?: PlanFeatureAssignment[];
}
