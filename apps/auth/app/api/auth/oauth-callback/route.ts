import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { setAuthCookies, clearAuthCookies } from "@/lib/api/cookies";
import { isTokenResponse } from "@/lib/api/guards";
import { parseErrorResponse } from "@/lib/api/errors";
import { z } from "zod";

const oauthCallbackSchema = z.object({
  provider: z.enum(["google", "microsoft"]),
  code: z.string().min(1),
  state: z.string().min(1),
});

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = oauthCallbackSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { provider, code, state } = parsed.data;
  const query = `code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
  const { status, body } = await proxyIdentity(
    `/identity/oauth/${provider}/callback?${query}`,
    { method: "GET", attachAccessToken: false, retryOn401: false }
  );

  const candidate = body as { mfa_token?: string } | null;
  if (status === 401 && typeof candidate?.mfa_token === "string") {
    return NextResponse.json(
      { ok: true, mfa_required: true, mfa_token: candidate.mfa_token },
      { status: 202 }
    );
  }

  if (status === 200 && isTokenResponse(body)) {
    await setAuthCookies(body.data);
    return NextResponse.json({ ok: true, user_id: body.data.user_id }, { status: 200 });
  }

  await clearAuthCookies();
  const error = parseErrorResponse(status, body);
  return NextResponse.json({ error: error.code, message: error.message }, { status });
}
