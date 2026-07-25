'use client';

import { useContext } from 'react';
import { AppContext } from './TenantContext';

export function useSchool() {
  const context = useContext(AppContext);
  return context.school;
}
