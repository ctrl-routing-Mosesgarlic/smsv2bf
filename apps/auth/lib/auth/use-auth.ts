"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";

interface SessionResponse {
  ok: boolean;
  authenticated: boolean;
  user_id?: string;
}

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const session = await apiRequest<SessionResponse>("/api/auth/session");
      setAuthenticated(session.authenticated);
      setUserId(session.user_id ?? null);
    } catch {
      setAuthenticated(false);
      setUserId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refresh);
  }, [refresh]);

  return { authenticated, userId, loading, refresh };
}
