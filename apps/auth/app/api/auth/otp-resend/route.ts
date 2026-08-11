import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { parseErrorResponse } from "@/lib/api/errors";
import { z } from "zod";

const resendSchema = z.object({
  email: z.string().email(),
  purpose: z.enum(["email_verification", "password_reset"]),
});

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = resendSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { status, body } = await proxyIdentity("/identity/otp/resend", {
    method: "POST",
    body: parsed.data,
    attachAccessToken: false,
    retryOn401: false,
  });

  if (status === 200) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const error = parseErrorResponse(status, body);
  return NextResponse.json({ error: error.code, message: error.message }, { status });
}
