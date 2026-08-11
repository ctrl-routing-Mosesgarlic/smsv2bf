import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { setAuthCookies, clearAuthCookies } from "@/lib/api/cookies";
import { isTokenResponse, isMfaRequired } from "@/lib/api/guards";
import { parseErrorResponse } from "@/lib/api/errors";
import { z } from "zod";

const oauthCallbackSchema = z.object({
  provider: z.string().min(1),
  code: z.string().min(1),
  tenant_id: z.string().optional(),
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

  const { status, body } = await proxyIdentity("/identity/oauth/callback", {
    method: "POST",
    body: parsed.data,
    attachAccessToken: false,
    retryOn401: false,
  });

  if (isMfaRequired(body)) {
    return NextResponse.json({ ok: true, mfa_required: true, mfa_token: body.mfa_token }, { status: 202 });
  }

  if (status === 200 && isTokenResponse(body)) {
    await setAuthCookies(body.data);
    return NextResponse.json({ ok: true, user_id: body.data.user_id }, { status: 200 });
  }

  await clearAuthCookies();
  const error = parseErrorResponse(status, body);
  return NextResponse.json({ error: error.code, message: error.message }, { status });
}
