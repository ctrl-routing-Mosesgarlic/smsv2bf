'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from '@cbc/shared';
import { PLATFORM_ROUTES } from '@cbc/config/routes';

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();

  const onSuccess = () => {
    const redirect = params.get('redirect');
    const target =
      redirect && redirect.startsWith('/') && !redirect.startsWith('//')
        ? redirect
        : PLATFORM_ROUTES.dashboard;
    router.replace(target);
  };

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-text-primary">Sign in</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Platform administration console
        </p>
      </div>
      {params.get('registered') && (
        <p className="mb-4 rounded border border-border-default px-3 py-2 text-center text-sm text-text-secondary">
          Account created. Check your phone or email for a verification code, then sign in.
        </p>
      )}
      <LoginForm onSuccess={onSuccess} />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
