'use client';

import { HttpClientProvider, AuthProvider } from '@cbc/shared';
import { AuthLayout } from '@cbc/ui';

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HttpClientProvider>
      <AuthProvider>
        <AuthLayout>
          {children}
        </AuthLayout>
      </AuthProvider>
    </HttpClientProvider>
  );
}
