'use client';

import { ReactNode } from 'react';
import { usePermissions } from './usePermissions';

interface RoleGateProps {
  role: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGate({
  role,
  children,
  fallback = null,
}: RoleGateProps) {
  const { hasRole } = usePermissions();

  if (hasRole(role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
