'use client';

import { createContext, ReactNode } from 'react';
import { API_ROUTES } from '@cbc/config/routes';
import { HttpClient } from './HttpClient';

export const HttpClientContext = createContext<HttpClient | null>(null);

interface HttpClientProviderProps {
  children: ReactNode;
  baseUrl?: string;
}

export function HttpClientProvider({
  children,
  baseUrl = process.env.NEXT_PUBLIC_API_URL || API_ROUTES.base,
}: HttpClientProviderProps) {
  const client = new HttpClient(baseUrl);
  return (
    <HttpClientContext.Provider value={client}>
      {children}
    </HttpClientContext.Provider>
  );
}
