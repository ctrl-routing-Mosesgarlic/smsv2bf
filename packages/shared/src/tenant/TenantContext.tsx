'use client';

import { createContext, ReactNode } from 'react';
import { TenantContext as TenantContextType, SchoolContext } from '../types';

interface AppContextValue {
  tenant: TenantContextType | null;
  school: SchoolContext | null;
}

export const AppContext = createContext<AppContextValue>({
  tenant: null,
  school: null,
});

interface AppContextProviderProps {
  children: ReactNode;
  value: AppContextValue;
}

export function AppContextProvider({
  children,
  value,
}: AppContextProviderProps) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
