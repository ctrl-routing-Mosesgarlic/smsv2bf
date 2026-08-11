import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/api/cookies";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; otp?: string }>;
}) {
  const hasSession = !!(await cookies()).get(COOKIE_NAMES.access)?.value;
  if (hasSession) redirect(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);

  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";
  const otp = typeof params.otp === "string" ? params.otp : "";

  return (
    <main className="container mx-auto">
      <Suspense>
        <ResetPasswordForm email={email} otp={otp} />
      </Suspense>
    </main>
  );
}

export default ResetPasswordPage;
