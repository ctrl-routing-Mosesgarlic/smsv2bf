import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { forgotPasswordSchema } from "@/lib/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = forgotPasswordSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  await proxyIdentity("/identity/forgot-password", {
    method: "POST",
    body: parsed.data,
    attachAccessToken: false,
    retryOn401: false,
  });

  // Always succeed to avoid user enumeration.
  return NextResponse.json({ ok: true }, { status: 200 });
}
