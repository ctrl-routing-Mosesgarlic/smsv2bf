"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardShell, ErrorAlert, PasswordInput } from "./shared";
import { OAuthButtons } from "./OAuthButtons";
import { registerSchema, type RegisterInput } from "@/lib/schemas";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import Link from "next/link";

interface RegisterResponse {
  ok: true;
  user_id?: string;
  otp_required?: boolean;
  email?: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { full_name: "", phone: "", email: "", password: "", password_confirmation: "" },
  });

  const onSubmit = async (values: RegisterInput) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiRequest<RegisterResponse>("/api/auth/register", { method: "POST", body: values });
      if (res.otp_required && res.email) {
        router.push(`/verify-otp?email=${encodeURIComponent(res.email)}&purpose=email_verification`);
        return;
      }
      window.location.assign(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCardShell
      title="Create account"
      footer={<div>Already have an account? <Link href="/login" className="hover:underline">Sign in</Link></div>}
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorAlert error={error} />
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" {...register("full_name")} aria-invalid={!!errors.full_name} />
            {errors.full_name ? <p className="text-xs text-destructive">{errors.full_name.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...register("phone")} aria-invalid={!!errors.phone} />
            {errors.phone ? <p className="text-xs text-destructive">{errors.phone.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
          </div>
          <PasswordInput id="password" label="Password" error={errors.password?.message} {...register("password")} />
          <PasswordInput id="password_confirmation" label="Confirm password" error={errors.password_confirmation?.message} {...register("password_confirmation")} />
<Button type="submit" className="w-full" disabled={!isValid || submitting}>
          {submitting ? "Creating…" : "Create account"}
          </Button>
        </form>
        <OAuthButtons />
      </div>
    </AuthCardShell>
  );
}
