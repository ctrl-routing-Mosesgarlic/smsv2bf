import type { SubscriptionPlan } from '../types';

interface FeatureEntry {
  enabled: boolean;
  value: string;
}

export const PLAN_FEATURE_MATRIX: Record<string, Record<string, FeatureEntry>> = {
  basic: {
    sms_alerts: { enabled: true, value: '' },
    max_sms_per_month: { enabled: true, value: '200' },
    custom_domain: { enabled: false, value: '' },
    api_access: { enabled: false, value: '' },
    priority_support: { enabled: false, value: '' },
    support_tier: { enabled: true, value: 'community' },
    advanced_analytics: { enabled: false, value: '' },
    white_labelling: { enabled: false, value: '' },
    dedicated_support: { enabled: false, value: '' },
    mpesa_integration: { enabled: true, value: '' },
    bank_reconciliation: { enabled: false, value: '' },
    multi_school: { enabled: false, value: '' },
  },
  standard: {
    sms_alerts: { enabled: true, value: '' },
    max_sms_per_month: { enabled: true, value: '500' },
    custom_domain: { enabled: false, value: '' },
    api_access: { enabled: false, value: '' },
    priority_support: { enabled: false, value: '' },
    support_tier: { enabled: true, value: 'email' },
    advanced_analytics: { enabled: false, value: '' },
    white_labelling: { enabled: false, value: '' },
    dedicated_support: { enabled: false, value: '' },
    mpesa_integration: { enabled: true, value: '' },
    bank_reconciliation: { enabled: true, value: '' },
    multi_school: { enabled: true, value: '' },
  },
  premium: {
    sms_alerts: { enabled: true, value: '' },
    max_sms_per_month: { enabled: true, value: '2000' },
    custom_domain: { enabled: true, value: '3' },
    api_access: { enabled: true, value: '' },
    priority_support: { enabled: true, value: '' },
    support_tier: { enabled: true, value: 'priority' },
    advanced_analytics: { enabled: true, value: '' },
    white_labelling: { enabled: false, value: '' },
    dedicated_support: { enabled: false, value: '' },
    mpesa_integration: { enabled: true, value: '' },
    bank_reconciliation: { enabled: true, value: '' },
    multi_school: { enabled: true, value: '' },
  },
  enterprise: {
    sms_alerts: { enabled: true, value: '' },
    max_sms_per_month: { enabled: true, value: 'unlimited' },
    custom_domain: { enabled: true, value: 'unlimited' },
    api_access: { enabled: true, value: '' },
    priority_support: { enabled: true, value: '' },
    support_tier: { enabled: true, value: 'dedicated' },
    advanced_analytics: { enabled: true, value: '' },
    white_labelling: { enabled: true, value: '' },
    dedicated_support: { enabled: true, value: '' },
    mpesa_integration: { enabled: true, value: '' },
    bank_reconciliation: { enabled: true, value: '' },
    multi_school: { enabled: true, value: '' },
  },
};

const FEATURE_LABELS: Record<string, string> = {
  sms_alerts: 'SMS Alerts',
  max_sms_per_month: 'SMS Messages Included',
  custom_domain: 'Custom Domain',
  api_access: 'API Access',
  priority_support: 'Priority Support',
  support_tier: 'Support Experience',
  advanced_analytics: 'Advanced Analytics',
  white_labelling: 'White Labelling',
  dedicated_support: 'Dedicated Support',
  mpesa_integration: 'M-Pesa Integration',
  bank_reconciliation: 'Bank Reconciliation',
  multi_school: 'Multi-School Management',
};

export function formatFeatureValue(code: string, enabled: boolean, value?: string): string {
  if (!enabled) return '—';
  if (value === 'unlimited') return 'Unlimited';
  if (code === 'max_sms_per_month') return `${Number(value).toLocaleString()} /mo`;
  if (code === 'custom_domain') return value ? `Up to ${value}` : 'No';
  if (code === 'support_tier') {
    const labels: Record<string, string> = {
      community: 'Community',
      email: 'Email Support',
      priority: 'Priority',
      dedicated: 'Dedicated',
    };
    return labels[value ?? ''] ?? value ?? '—';
  }
  return '';
}

export function getPlanFeatureLabels(): Record<string, string> {
  return FEATURE_LABELS;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    plan_id: '00000000-0000-0000-0000-000000000001',
    plan_code: 'basic',
    plan_name: 'Basic',
    billing_cycle: 'monthly',
    price: 2500,
    currency: 'KES',
    max_schools: 1,
    max_users: 50,
    max_students: 500,
    max_teachers: 30,
    max_storage_mb: 2048,
    is_active: true,
  },
  {
    plan_id: '00000000-0000-0000-0000-000000000002',
    plan_code: 'standard',
    plan_name: 'Standard',
    billing_cycle: 'monthly',
    price: 5000,
    currency: 'KES',
    max_schools: 3,
    max_users: 200,
    max_students: 2000,
    max_teachers: 100,
    max_storage_mb: 10240,
    is_active: true,
  },
  {
    plan_id: '00000000-0000-0000-0000-000000000003',
    plan_code: 'premium',
    plan_name: 'Premium',
    billing_cycle: 'monthly',
    price: 12000,
    currency: 'KES',
    max_schools: 10,
    max_users: 1000,
    max_students: 10000,
    max_teachers: 500,
    max_storage_mb: 51200,
    is_active: true,
  },
  {
    plan_id: '00000000-0000-0000-0000-000000000004',
    plan_code: 'enterprise',
    plan_name: 'Enterprise',
    billing_cycle: 'yearly',
    price: 120000,
    currency: 'KES',
    max_schools: 100,
    max_users: 50000,
    max_students: 500000,
    max_teachers: 10000,
    max_storage_mb: 1048576,
    is_active: true,
  },
];

export function getYearlyPrice(monthlyPrice: number): number {
  return monthlyPrice * 10;
}

export function getPlansGrouped(): SubscriptionPlan[][] {
  const groups: Record<string, SubscriptionPlan[]> = {};
  for (const plan of SUBSCRIPTION_PLANS) {
    let group = groups[plan.plan_code];
    if (!group) {
      group = [];
      groups[plan.plan_code] = group;
    }
    group.push(plan);
  }
  return Object.values(groups);
}
