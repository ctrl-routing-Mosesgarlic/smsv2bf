"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardShell, ErrorAlert, PasswordInput } from "./shared";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/schemas";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import Link from "next/link";

export function ResetPasswordForm({ email, otp }: { email: string; otp: string }) {
  const [error, setError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { email, otp, password: "", password_confirmation: "" },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest<{ ok: true }>("/api/auth/reset-password", { method: "POST", body: values });
      window.location.assign(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCardShell
      title="Set new password"
      footer={<Link href="/login" className="hover:underline">Back to sign in</Link>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ErrorAlert error={error} />
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" readOnly={!!email} {...register("email")} aria-invalid={!!errors.email} />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="otp">Reset code</Label>
          <Input id="otp" inputMode="numeric" maxLength={6} placeholder="000000" {...register("otp")} aria-invalid={!!errors.otp} />
          {errors.otp ? <p className="text-xs text-destructive">{errors.otp.message}</p> : null}
        </div>
        <PasswordInput id="password" label="New password" error={errors.password?.message} {...register("password")} />
        <PasswordInput id="password_confirmation" label="Confirm new password" error={errors.password_confirmation?.message} {...register("password_confirmation")} />
        <Button type="submit" className="w-full" disabled={!isValid || submitting}>
          {submitting ? "Resetting…" : "Reset password"}
        </Button>
      </form>
    </AuthCardShell>
  );
}
