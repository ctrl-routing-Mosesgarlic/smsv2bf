import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/api/cookies";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import { RegisterForm } from "@/components/auth/RegisterForm";

async function RegisterPage() {
  const hasSession = !!(await cookies()).get(COOKIE_NAMES.access)?.value;
  if (hasSession) redirect(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);
  return (
    <main className="container mx-auto">
      <RegisterForm />
    </main>
  );
}

export default RegisterPage;
