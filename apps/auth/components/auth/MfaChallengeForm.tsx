"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardShell, ErrorAlert } from "./shared";
import { mfaChallengeSchema, type MfaChallengeInput } from "@/lib/schemas";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import Link from "next/link";

export function MfaChallengeForm({ mfaToken }: { mfaToken: string }) {
  const [error, setError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MfaChallengeInput>({
    resolver: zodResolver(mfaChallengeSchema),
    defaultValues: { mfa_token: mfaToken, code: "" },
  });

  const onSubmit = async (values: MfaChallengeInput) => {
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest<{ ok: true }>("/api/auth/mfa-challenge", { method: "POST", body: values });
      window.location.assign(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCardShell
      title="Two-factor authentication"
      description="Enter the 6-digit code from your authenticator app."
      footer={<Link href="/login" className="hover:underline">Back to sign in</Link>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ErrorAlert error={error} />
        <div className="space-y-2">
          <Label htmlFor="code">Authenticator code</Label>
          <Input id="code" inputMode="numeric" maxLength={6} placeholder="000000" {...register("code")} aria-invalid={!!errors.code} />
          {errors.code ? <p className="text-xs text-destructive">{errors.code.message}</p> : null}
        </div>
        <Button type="submit" className="w-full" disabled={submitting || !mfaToken}>
          {submitting ? "Verifying…" : "Verify"}
        </Button>
      </form>
    </AuthCardShell>
  );
}
