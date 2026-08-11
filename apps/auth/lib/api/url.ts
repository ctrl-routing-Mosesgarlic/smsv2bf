import { IDENTITY_API_URL } from "@/lib/config/env";

export function identityUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`identityUrl expects a path starting with "/", got: ${path}`);
  }
  return `${IDENTITY_API_URL}${path}`;
}
