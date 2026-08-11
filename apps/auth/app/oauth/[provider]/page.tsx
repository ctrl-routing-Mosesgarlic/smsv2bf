import { redirect } from "next/navigation";
import Link from "next/link";
import { proxyIdentity } from "@/lib/api/identity";
import { NEXT_PUBLIC_DEFAULT_TENANT_ID } from "@/lib/config/env";

async function OAuthProviderPage({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider } = await params;

  const { status, body } = await proxyIdentity("/identity/oauth/redirect", {
    method: "POST",
    body: { provider, tenant_id: NEXT_PUBLIC_DEFAULT_TENANT_ID },
    attachAccessToken: false,
    retryOn401: false,
  });

  const candidate = body as { redirect_url?: string; message?: string } | null;
  if (status === 200 && typeof candidate?.redirect_url === "string") {
    redirect(candidate.redirect_url);
  }

  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-lg font-semibold">Unable to start sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">{candidate?.message ?? "Please try again."}</p>
      <Link href="/login" className="mt-4 inline-block text-sm underline">Back to sign in</Link>
    </main>
  );
}

export default OAuthProviderPage;
