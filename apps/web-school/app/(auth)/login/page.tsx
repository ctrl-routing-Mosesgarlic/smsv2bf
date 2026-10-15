'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from '@cbc/shared';

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();

  const onSuccess = () => {
    const redirect = params.get('redirect');
    const target =
      redirect && redirect.startsWith('/') && !redirect.startsWith('//')
        ? redirect
        : '/admin/dashboard';
    router.replace(target);
  };

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-text-primary">School Portal</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Sign in to access your school dashboard
        </p>
      </div>
      <LoginForm onSuccess={onSuccess} />
    </>
  );
}

export default function SchoolLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
