"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardShell, ErrorAlert, SuccessAlert } from "./shared";
import { otpSchema, type OtpInput } from "@/lib/schemas";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import Link from "next/link";

interface OtpVerifyResponse {
  ok: true;
  user_id?: string;
  mfa_required?: boolean;
  mfa_token?: string;
}

export function OtpVerifyForm({
  email,
  purpose,
}: {
  email?: string;
  purpose: "email_verification" | "password_reset";
}) {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "", purpose },
  });

  const onSubmit = async (values: OtpInput) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await apiRequest<OtpVerifyResponse>("/api/auth/otp-verify", {
        method: "POST",
        body: { ...values, email },
      });
      if (res.mfa_required && res.mfa_token) {
        router.push(`/mfa-challenge?mfa_token=${encodeURIComponent(res.mfa_token)}`);
        return;
      }
      if (res.user_id) {
        window.location.assign(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);
        return;
      }
      setSuccess("Code verified.");
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      await apiRequest<{ ok: true }>("/api/auth/otp-resend", { method: "POST", body: { email, purpose } });
      setSuccess("A new code was sent.");
      setCountdown(60);
      const timer = setInterval(() => setCountdown((c) => (c <= 1 ? (clearInterval(timer), 0) : c - 1)), 1000);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthCardShell
      title="Verify code"
      description={`Enter the 6-digit code sent to ${email ?? "you"}.`}
      footer={
        <Link href="/login" className="hover:underline">Back to sign in</Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ErrorAlert error={error} />
        {success ? <SuccessAlert>{success}</SuccessAlert> : null}
        <div className="space-y-2">
          <Label htmlFor="code">6-digit code</Label>
          <Input id="code" inputMode="numeric" maxLength={6} placeholder="000000" {...register("code")} aria-invalid={!!errors.code} />
          {errors.code ? <p className="text-xs text-destructive">{errors.code.message}</p> : null}
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Verifying…" : "Verify"}
        </Button>
        <Button type="button" variant="ghost" className="w-full" onClick={onResend} disabled={countdown > 0 || resending}>
          {countdown > 0 ? `Resend in ${countdown}s` : resending ? "Sending…" : "Resend code"}
        </Button>
      </form>
    </AuthCardShell>
  );
}
