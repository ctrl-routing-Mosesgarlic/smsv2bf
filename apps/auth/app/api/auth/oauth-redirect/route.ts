import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { parseErrorResponse } from "@/lib/api/errors";
import { z } from "zod";
import { NEXT_PUBLIC_DEFAULT_TENANT_ID } from "@/lib/config/env";

const oauthRedirectSchema = z.object({
  provider: z.enum(["google", "microsoft"]),
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

  if (!NEXT_PUBLIC_DEFAULT_TENANT_ID) {
    return NextResponse.json(
      { error: "invalid_config", message: "NEXT_PUBLIC_DEFAULT_TENANT_ID is not configured." },
      { status: 500 }
    );
  }

  const { provider } = parsed.data;
  const tenantId = encodeURIComponent(NEXT_PUBLIC_DEFAULT_TENANT_ID);
  const { status, body } = await proxyIdentity(
    `/identity/oauth/${provider}/redirect?tenant_id=${tenantId}`,
    { method: "GET", attachAccessToken: false, retryOn401: false }
  );

  const candidate = body as { url?: string; message?: string } | null;
  if (status === 200 && typeof candidate?.url === "string") {
    return NextResponse.json({ url: candidate.url }, { status: 200 });
  }

  const error = parseErrorResponse(status, body);
  return NextResponse.json({ error: error.code, message: error.message }, { status });
}
