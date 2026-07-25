'use client';

import { useState, FormEvent } from 'react';
import { API_ROUTES } from '@cbc/config/routes';
import { useHttpClient } from '../api/useHttpClient';

export function ForgotPasswordForm() {
  const httpClient = useHttpClient();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await httpClient.post(API_ROUTES.forgotPassword, { email });
      setIsSubmitted(true);
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="text-gray-600">
          If an account with that email exists, we&apos;ve sent a password reset
          link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
}
