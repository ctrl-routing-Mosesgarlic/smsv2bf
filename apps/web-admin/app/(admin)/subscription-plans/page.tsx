'use client';

import { useRouter } from 'next/navigation';
import { PricingCard } from '@cbc/ui';
import {
  SUBSCRIPTION_PLANS,
  PLAN_FEATURE_MATRIX,
  getPlanFeatureLabels,
  formatFeatureValue,
} from '@cbc/shared';

function formatStorage(mb: number): string {
  if (mb >= 1048576) return `${(mb / 1048576).toFixed(0)} TB`;
  if (mb >= 1024) return `${(mb / 1024).toFixed(0)} GB`;
  return `${mb} MB`;
}

export default function SubscriptionPlansPage() {
  const router = useRouter();
  const labels = getPlanFeatureLabels();
  const featureKeys = Object.keys(PLAN_FEATURE_MATRIX.basic!);

  const enriched = SUBSCRIPTION_PLANS.map((plan) => {
    const matrix = PLAN_FEATURE_MATRIX[plan.plan_code]!;
    const isYearly = plan.billing_cycle === 'yearly';
    const priceLabel = `KSh ${plan.price.toLocaleString()}${isYearly ? '/year' : '/month'}`;

    const features = featureKeys.map((key) => {
      const f = matrix[key]!;
      return {
        label: labels[key] ?? key,
        value: formatFeatureValue(key, f.enabled, f.value),
        included: f.enabled,
      };
    });

    const specs = [
      `Up to ${plan.max_students.toLocaleString()} students`,
      `Up to ${plan.max_users.toLocaleString()} users`,
      `Up to ${plan.max_teachers.toLocaleString()} teachers`,
      `${formatStorage(plan.max_storage_mb)} storage`,
    ];

    return {
      key: plan.plan_id,
      planName: plan.plan_name,
      planCode: plan.plan_code,
      priceLabel,
      specs,
      features,
      ctaLabel: 'Edit Plan',
      highlighted: false,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Subscription Plans</h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage pricing tiers, feature assignments, and plan availability.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {enriched.map((plan) => (
          <PricingCard
            key={plan.key}
            planName={plan.planName}
            planCode={plan.planCode}
            priceLabel={plan.priceLabel}
            periodLabel=""
            specs={plan.specs}
            features={plan.features}
            ctaLabel={plan.ctaLabel}
            highlighted={plan.highlighted}
            onCtaClick={() => {
              router.push(`/admin/subscription-plans/${plan.planCode}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}
