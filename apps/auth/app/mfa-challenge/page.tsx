import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/api/cookies";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import { MfaChallengeForm } from "@/components/auth/MfaChallengeForm";

async function MfaChallengePage({
  searchParams,
}: {
  searchParams: Promise<{ mfa_token?: string }>;
}) {
  const hasSession = !!(await cookies()).get(COOKIE_NAMES.access)?.value;
  if (hasSession) redirect(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);

  const params = await searchParams;
  const mfaToken = typeof params.mfa_token === "string" ? params.mfa_token : "";

  return (
    <main className="container mx-auto">
      <Suspense>
        <MfaChallengeForm mfaToken={mfaToken} />
      </Suspense>
    </main>
  );
}

export default MfaChallengePage;
