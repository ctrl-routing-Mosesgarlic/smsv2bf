'use client';

import { ExternalPortalLayout } from '@cbc/ui';
import { SCHOOL_ROUTES } from '@cbc/config/routes';

const EXTERNAL_NAV_ITEMS = [
  { label: 'Governance', href: SCHOOL_ROUTES.externalGovernance },
  { label: 'Sponsorship', href: SCHOOL_ROUTES.externalSponsorship },
  { label: 'Examination', href: SCHOOL_ROUTES.externalExamination },
  { label: 'Inspection', href: SCHOOL_ROUTES.externalInspection },
  { label: 'Audit', href: SCHOOL_ROUTES.externalAudit },
  { label: 'NEMIS', href: SCHOOL_ROUTES.externalNemis },
  { label: 'Compliance', href: SCHOOL_ROUTES.externalCompliance },
];

export default function ExternalLayout({ children }: { children: React.ReactNode }) {
  const schoolName = 'School'; // Would come from SchoolContext

  return (
    <ExternalPortalLayout
      navItems={EXTERNAL_NAV_ITEMS}
      schoolName={schoolName}
    >
      {children}
    </ExternalPortalLayout>
  );
}
