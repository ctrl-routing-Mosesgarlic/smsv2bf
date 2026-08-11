"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardShell, ErrorAlert, PasswordInput } from "./shared";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import Link from "next/link";

interface LoginResponse {
  ok: true;
  user_id?: string;
  mfa_required?: boolean;
  mfa_token?: string;
}

export function LoginForm({ returnTo }: { returnTo?: string }) {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiRequest<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: values,
      });
      if (res.mfa_required && res.mfa_token) {
        router.push(`/mfa-challenge?mfa_token=${encodeURIComponent(res.mfa_token)}`);
        return;
      }
      const destination = returnTo ?? NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT;
      window.location.assign(destination);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCardShell
      title="Sign in"
      description="Enter your email or phone and password."
      footer={
        <div className="space-y-1">
          <Link href="/forgot-password" className="hover:underline">Forgot password?</Link>
          <div>No account? <Link href="/register" className="hover:underline">Register</Link></div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ErrorAlert error={error} />
        <div className="space-y-2">
          <Label htmlFor="identifier">Email or phone</Label>
          <Input id="identifier" {...register("identifier")} aria-invalid={!!errors.identifier} />
          {errors.identifier ? <p className="text-xs text-destructive">{errors.identifier.message}</p> : null}
        </div>
        <PasswordInput id="password" label="Password" error={errors.password?.message} {...register("password")} />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCardShell>
  );
}
