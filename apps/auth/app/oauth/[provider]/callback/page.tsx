import Link from "next/link";
import { OAuthCallbackForm } from "@/components/auth/OAuthCallbackForm";

async function OAuthCallbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ provider: string }>;
  searchParams: Promise<{ code?: string; state?: string; tenant_id?: string }>;
}) {
  const { provider } = await params;
  const { code, tenant_id } = await searchParams;

  if (!code) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-lg font-semibold">Sign in failed</h1>
        <p className="mt-2 text-sm text-muted-foreground">No authorization code was returned.</p>
        <Link href="/login" className="mt-4 inline-block text-sm underline">Back to sign in</Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <OAuthCallbackForm provider={provider} code={code} tenant_id={tenant_id} />
    </main>
  );
}

export default OAuthCallbackPage;
