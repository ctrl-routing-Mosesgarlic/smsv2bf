import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { setAuthCookies, clearAuthCookies } from "@/lib/api/cookies";
import { isTokenResponse } from "@/lib/api/guards";
import { parseErrorResponse } from "@/lib/api/errors";
import { resetPasswordSchema } from "@/lib/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = resetPasswordSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { status, body } = await proxyIdentity("/identity/reset-password", {
    method: "POST",
    body: parsed.data,
    attachAccessToken: false,
    retryOn401: false,
  });

  if (status === 200 && isTokenResponse(body)) {
    await setAuthCookies(body.data);
    return NextResponse.json({ ok: true, user_id: body.data.user_id }, { status: 200 });
  }

  await clearAuthCookies();
  const error = parseErrorResponse(status, body);
  return NextResponse.json({ error: error.code, message: error.message }, { status });
}
