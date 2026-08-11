import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/api/cookies";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import { LoginForm } from "@/components/auth/LoginForm";

async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const hasSession = !!(await cookies()).get(COOKIE_NAMES.access)?.value;
  if (hasSession) redirect(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);

  const params = await searchParams;
  const next = params.next;
  const returnTo =
    typeof next === "string" &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.includes("\\") &&
    !next.includes("%5c")
      ? next
      : undefined;

  return (
    <main className="container mx-auto">
      <Suspense>
        <LoginForm returnTo={returnTo} />
      </Suspense>
    </main>
  );
}

export default LoginPage;
