'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from './useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
}

const SLOW_AFTER_MS = 4000;

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!submitting) {
      setSlow(false);
      return;
    }
    const t = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(t);
  }, [submitting]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      onSuccess?.();
    } catch (err: unknown) {
      const apiError = err as { message?: string; errorCode?: string };
      setError(
        apiError.errorCode === 'MFA_REQUIRED'
          ? 'Multi-factor authentication is required for this account.'
          : apiError.message || 'Login failed. Please try again.'
      );
      setSubmitting(false);
    }
  };

  const inputClass =
    'block w-full rounded-lg border border-border-default bg-surface px-3 py-2 text-sm text-text-primary shadow-sm placeholder:text-text-muted focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus disabled:opacity-60';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-danger-border bg-danger-light px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      )}
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-text-primary">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={submitting}
          className={inputClass}
          placeholder="you@school.ac.ke"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-text-primary">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={submitting}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && (
          <svg className="-ml-1 mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {submitting ? 'Signing in...' : 'Sign In'}
      </button>
      {slow && (
        <p className="text-center text-xs text-text-muted" role="status">
          Still working — the server is responding slowly. Please keep this page open.
        </p>
      )}
    </form>
  );
}
