import { cookies } from "next/headers";
import { SESSION_COOKIE_DOMAIN } from "@/lib/config/env";
import type { TokenData } from "./guards";

export const COOKIE_NAMES = {
  access: "access_token",
  refresh: "refresh_token",
  session: "session",
} as const;

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_NAMES.access)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_NAMES.refresh)?.value;
}

export async function getSessionUserId(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_NAMES.session)?.value;
}

export async function setAuthCookies(data: TokenData): Promise<void> {
  const store = await cookies();
  const base = {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  store.set(COOKIE_NAMES.access, data.access_token, {
    ...base,
    maxAge: data.expires_in ?? 900,
  });
  store.set(COOKIE_NAMES.refresh, data.refresh_token, {
    ...base,
    maxAge: 30 * 24 * 60 * 60,
  });
  store.set(COOKIE_NAMES.session, data.user_id, {
    ...base,
    maxAge: 30 * 24 * 60 * 60,
    ...(SESSION_COOKIE_DOMAIN ? { domain: SESSION_COOKIE_DOMAIN } : {}),
  });
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAMES.access);
  store.delete(COOKIE_NAMES.refresh);
  store.delete({
    name: COOKIE_NAMES.session,
    ...(SESSION_COOKIE_DOMAIN ? { domain: SESSION_COOKIE_DOMAIN } : {}),
  });
}
