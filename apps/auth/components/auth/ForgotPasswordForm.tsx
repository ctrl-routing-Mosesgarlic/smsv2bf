"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardShell, ErrorAlert, SuccessAlert } from "./shared";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/schemas";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import Link from "next/link";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);
  const [done, setDone] = useState<false | { email: string }>(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest<{ ok: true }>("/api/auth/forgot-password", { method: "POST", body: values });
      setDone({ email: values.email });
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCardShell
      title="Forgot password"
      footer={<Link href="/login" className="hover:underline">Back to sign in</Link>}
    >
      {done ? (
        <div className="space-y-4">
          <SuccessAlert>
            If an account exists for that email, a password reset code was sent.
          </SuccessAlert>
          <Button type="button" className="w-full" onClick={() => router.push(`/verify-otp?email=${encodeURIComponent(done.email)}&purpose=password_reset`)}>
            Enter reset code
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorAlert error={error} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
          </div>
          <Button type="submit" className="w-full" disabled={!isValid || submitting}>
            {submitting ? "Sending…" : "Send reset code"}
          </Button>
        </form>
      )}
    </AuthCardShell>
  );
}
