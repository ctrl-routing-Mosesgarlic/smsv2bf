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

export default function PricingPage() {
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

    const isHighlighted = plan.plan_code === 'standard';
    const isEnterprise = plan.plan_code === 'enterprise';

    return {
      key: plan.plan_id,
      planName: plan.plan_name,
      planCode: plan.plan_code,
      priceLabel,
      specs,
      features,
      ctaLabel: isEnterprise ? 'Contact Sales' : 'Start Free Trial',
      highlighted: isHighlighted,
      enterprise: isEnterprise,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Choose the plan that fits your school. All plans include a 14-day free trial.
          No credit card required.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
              router.push(plan.enterprise ? '/contact' : '/register');
            }}
          />
        ))}
      </div>
    </div>
  );
}
