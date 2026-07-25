'use client';

import { useState, FormEvent, useRef } from 'react';
import { API_ROUTES } from '@cbc/config/routes';
import { useHttpClient } from '../api/useHttpClient';

interface OtpVerificationFormProps {
  phone: string;
  purpose: 'verification' | 'password_reset';
  onVerified: () => void;
}

export function OtpVerificationForm({
  phone,
  purpose,
  onVerified,
}: OtpVerificationFormProps) {
  const httpClient = useHttpClient();
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await httpClient.post(API_ROUTES.otpVerify, {
        phone,
        code: code.join(''),
        purpose,
      });
      onVerified();
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <p className="text-sm text-gray-600 text-center">
        Enter the 6-digit code sent to {phone}
      </p>
      <div className="flex gap-2 justify-center">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-10 h-12 text-center border rounded text-lg"
            autoFocus={index === 0}
          />
        ))}
      </div>
      <button
        type="submit"
        disabled={isLoading || code.some((d) => !d)}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  );
}
