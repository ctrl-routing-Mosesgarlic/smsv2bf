'use client';

import { ReactNode } from 'react';

interface FeatureRow {
  label: string;
  value: string;
  included: boolean;
}

interface PricingCardProps {
  planName: string;
  planCode: string;
  priceLabel: string;
  periodLabel: string;
  specs: string[];
  features: FeatureRow[];
  ctaLabel: string;
  onCtaClick: () => void;
  highlighted?: boolean;
  badge?: ReactNode;
}

export function PricingCard({
  planName,
  priceLabel,
  specs,
  features,
  ctaLabel,
  onCtaClick,
  highlighted = false,
  badge,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-xl p-6 sm:p-8 border flex flex-col ${
        highlighted
          ? 'border-primary ring-2 ring-primary bg-surface'
          : 'border-border-default bg-surface'
      }`}
    >
      {badge ? (
        badge
      ) : highlighted ? (
        <span className="inline-block px-3 py-1 bg-primary-light text-primary text-xs font-semibold rounded-full mb-4 w-fit">
          Most Popular
        </span>
      ) : null}

      <h3 className="text-xl font-bold text-text-primary">{planName}</h3>

      <div className="mt-4 mb-4">
        <span className="text-4xl font-bold text-text-primary">
          {priceLabel}
        </span>
      </div>

      {specs.length > 0 && (
        <div className="text-sm text-text-secondary mb-6 space-y-1">
          {specs.map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
      )}

      <hr className="border-border-default mb-6" />

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f) => (
          <li key={f.label} className="text-sm flex items-start gap-2">
            <span
              className={`mt-0.5 shrink-0 ${
                f.included ? 'text-success' : 'text-text-muted'
              }`}
            >
              {f.included ? '\u2713' : '\u2014'}
            </span>
            <span className={f.included ? 'text-text-primary' : 'text-text-muted'}>
              {f.label}
              {f.included && f.value ? (
                <span className="text-text-secondary ml-1">({f.value})</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={onCtaClick}
        className={`block w-full text-center py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
          highlighted
            ? 'bg-primary text-on-primary hover:bg-primary-hover'
            : 'bg-surface-muted text-text-primary hover:bg-border-default'
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
