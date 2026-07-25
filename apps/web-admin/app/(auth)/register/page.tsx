'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { AUTH_ROUTES } from '@cbc/config/routes';
import { useHttpClient } from '@cbc/shared';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const httpClient = useHttpClient();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await httpClient.post('/auth/register', {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.passwordConfirmation,
      });
      router.push(AUTH_ROUTES.login);
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-danger-light border border-danger-border text-danger px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-1">
            First Name
          </label>
          <input
            id="firstName"
            value={form.firstName}
            onChange={update('firstName')}
            required
            className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-border-focus"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            value={form.lastName}
            onChange={update('lastName')}
            required
            className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-border-focus"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={update('email')}
          required
          className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-border-focus"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-1">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={update('phone')}
          required
          className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-border-focus"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={update('password')}
          required
          minLength={8}
          className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-border-focus"
        />
      </div>
      <div>
        <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-text-primary mb-1">
          Confirm Password
        </label>
        <input
          id="passwordConfirmation"
          type="password"
          value={form.passwordConfirmation}
          onChange={update('passwordConfirmation')}
          required
          minLength={8}
          className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-border-focus"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-on-primary py-2 rounded-lg hover:bg-primary-hover disabled:opacity-50 font-medium text-sm transition-colors"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>
      <p className="text-center text-xs text-text-muted">
        Already have an account?{' '}
        <Link href={AUTH_ROUTES.login} className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
