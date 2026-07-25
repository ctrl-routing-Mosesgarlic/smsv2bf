'use client';

import { useContext } from 'react';
import { AppContext } from './TenantContext';

export function useTenant() {
  const context = useContext(AppContext);
  if (!context.tenant) {
    throw new Error('useTenant must be used within an AppContextProvider with a tenant');
  }
  return context.tenant;
}
