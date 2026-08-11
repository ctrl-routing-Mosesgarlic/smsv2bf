import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { parseErrorResponse } from "@/lib/api/errors";
import { z } from "zod";

const oauthRedirectSchema = z.object({
  provider: z.string().min(1),
  tenant_id: z.string().optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = oauthRedirectSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { status, body } = await proxyIdentity("/identity/oauth/redirect", {
    method: "POST",
    body: parsed.data,
    attachAccessToken: false,
    retryOn401: false,
  });

  const candidate = body as { redirect_url?: string } | null;
  if (status === 200 && typeof candidate?.redirect_url === "string") {
    return NextResponse.json({ redirect_url: candidate.redirect_url }, { status: 200 });
  }

  const error = parseErrorResponse(status, body);
  return NextResponse.json({ error: error.code, message: error.message }, { status });
}
