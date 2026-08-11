"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "./shared";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

interface OAuthRedirectResponse {
  url: string;
}

const PROVIDERS = [
  {
    id: "google",
    label: "Google",
    icon: "https://img.logo.dev/google.com?token=pk_LqNDeLVVSgGaJvSw8he-Tw&format=webp&retina=true",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    icon: "https://img.logo.dev/microsoft.com?token=pk_LqNDeLVVSgGaJvSw8he-Tw&format=webp&retina=true",
  },
] as const;

export function OAuthButtons() {
  const [error, setError] = useState<ApiError | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const start = async (provider: string) => {
    setPending(provider);
    setError(null);
    try {
      const res = await apiRequest<OAuthRedirectResponse>("/api/auth/oauth-redirect", {
        method: "POST",
        body: { provider },
      });
      window.location.assign(res.url);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
      setPending(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or continue with</span>
        </div>
      </div>
      <ErrorAlert error={error} />
      <div className="grid grid-cols-2 gap-3">
        {PROVIDERS.map((p) => (
          <Button
            key={p.id}
            type="button"
            variant="outline"
            disabled={pending !== null}
            onClick={() => start(p.id)}
          >
            {pending === p.id ? (
              "Redirecting…"
            ) : (
              <>
                <Image src={p.icon} alt="" width={16} height={16} unoptimized />
                {p.label}
              </>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
