import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/api/cookies";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import { OtpVerifyForm } from "@/components/auth/OtpVerifyForm";

async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; purpose?: string }>;
}) {
  const hasSession = !!(await cookies()).get(COOKIE_NAMES.access)?.value;
  if (hasSession) redirect(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);

  const params = await searchParams;
  const purpose = params.purpose === "password_reset" ? "password_reset" : "email_verification";
  const email = typeof params.email === "string" ? params.email : undefined;

  return (
    <main className="container mx-auto">
      <Suspense>
        <OtpVerifyForm email={email} purpose={purpose} />
      </Suspense>
    </main>
  );
}

export default VerifyOtpPage;
