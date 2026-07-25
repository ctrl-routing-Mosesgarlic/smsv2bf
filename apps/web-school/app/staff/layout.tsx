'use client';

import { StaffDashboardLayout } from '@cbc/ui';
import { getStaffNavItems } from '@cbc/shared';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  // In a real app, the role would come from AuthContext.
  // For now, fall back to a generic dashboard nav.
  const roleKey = 'security_officer';
  const navItems = getStaffNavItems(roleKey);

  return <StaffDashboardLayout navItems={navItems}>{children}</StaffDashboardLayout>;
}
