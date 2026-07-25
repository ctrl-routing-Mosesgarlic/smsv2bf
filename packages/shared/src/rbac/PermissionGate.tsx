'use client';

import { ReactNode } from 'react';
import { usePermissions } from './usePermissions';

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission } = usePermissions();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
