import { identityUrl } from "./url";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "./cookies";
import { isTokenResponse } from "./guards";

interface ProxyOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  attachAccessToken?: boolean;
  retryOn401?: boolean;
}

interface IdentityResult {
  status: number;
  body: unknown;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  const response = await fetch(identityUrl("/identity/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) {
    await clearAuthCookies();
    return false;
  }

  const body: unknown = await response.json();
  if (!isTokenResponse(body)) {
    await clearAuthCookies();
    return false;
  }

  await setAuthCookies(body.data);
  return true;
}

export async function proxyIdentity(
  path: string,
  options: ProxyOptions = {}
): Promise<IdentityResult> {
  const {
    method = "GET",
    body,
    attachAccessToken = true,
    retryOn401 = true,
  } = options;

  const call = async (): Promise<IdentityResult> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (attachAccessToken) {
      const accessToken = await getAccessToken();
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(identityUrl(path), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });

    const text = await response.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }
    return { status: response.status, body: parsed };
  };

  const first = await call();
  if (first.status === 401 && retryOn401 && attachAccessToken) {
    const refreshed = await tryRefresh();
    if (refreshed) return call();
  }
  return first;
}
