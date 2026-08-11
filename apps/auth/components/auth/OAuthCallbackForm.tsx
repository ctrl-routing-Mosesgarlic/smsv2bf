"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";

interface OAuthCallbackResponse {
  ok: true;
  user_id?: string;
  mfa_required?: boolean;
  mfa_token?: string;
}

export function OAuthCallbackForm({
  provider,
  code,
  state,
}: {
  provider: string;
  code: string;
  state: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);

  const complete = useCallback(async () => {
    try {
      const res = await apiRequest<OAuthCallbackResponse>("/api/auth/oauth-callback", {
        method: "POST",
        body: { provider, code, state },
      });
      if (res.mfa_required && res.mfa_token) {
        router.replace(`/mfa-challenge?mfa_token=${encodeURIComponent(res.mfa_token)}`);
        return;
      }
      window.location.assign(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    }
  }, [provider, code, state, router]);

  useEffect(() => {
    const run = async () => {
      await complete();
    };
    void run();
  }, [complete]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      {error ? (
        <>
          <h1 className="text-lg font-semibold">Sign in failed</h1>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Link href="/login" className="text-sm underline">Back to sign in</Link>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Completing sign in…</p>
      )}
    </div>
  );
}
