'use client';

import { createContext, ReactNode, useMemo } from 'react';
import { API_ROUTES } from '@cbc/config/routes';
import { HttpClient } from './HttpClient';

export const HttpClientContext = createContext<HttpClient | null>(null);

interface HttpClientProviderProps {
  children: ReactNode;
  baseUrl?: string;
}

export function HttpClientProvider({
  children,
  baseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${API_ROUTES.base}`,
}: HttpClientProviderProps) {
  const client = useMemo(() => new HttpClient(baseUrl), [baseUrl]);
  return (
    <HttpClientContext.Provider value={client}>
      {children}
    </HttpClientContext.Provider>
  );
}
