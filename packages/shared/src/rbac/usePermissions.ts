'use client';

import { useAuth } from '../auth/useAuth';

export function usePermissions() {
  const { user, hasRole, hasPermission } = useAuth();

  return {
    roles: user?.roles ?? [],
    permissions: user?.permissions ?? [],
    hasRole,
    hasPermission,
  };
}
