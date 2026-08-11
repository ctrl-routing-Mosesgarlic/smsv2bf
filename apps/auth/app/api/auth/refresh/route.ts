import { NextResponse } from "next/server";
import { getRefreshToken, clearAuthCookies } from "@/lib/api/cookies";
import { identityUrl } from "@/lib/api/url";
import { isTokenResponse } from "@/lib/api/guards";
import { setAuthCookies } from "@/lib/api/cookies";

export async function POST(): Promise<NextResponse> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearAuthCookies();
    return NextResponse.json({ ok: false, message: "No refresh token." }, { status: 401 });
  }

  const response = await fetch(identityUrl("/identity/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok || !isTokenResponse(body)) {
    await clearAuthCookies();
    return NextResponse.json({ ok: false, message: "Session expired." }, { status: 401 });
  }

  await setAuthCookies(body.data);
  return NextResponse.json({ ok: true }, { status: 200 });
}
