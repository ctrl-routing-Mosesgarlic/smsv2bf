'use client';

import { useContext } from 'react';
import { HttpClientContext } from './HttpClientContext';
import type { HttpClient } from './HttpClient';

export function useHttpClient(): HttpClient {
  const client = useContext(HttpClientContext);
  if (!client) {
    throw new Error('useHttpClient must be used within an HttpClientProvider');
  }
  return client;
}
