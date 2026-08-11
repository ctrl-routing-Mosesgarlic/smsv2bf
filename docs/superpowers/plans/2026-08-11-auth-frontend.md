# Auth Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the authentication frontend in `apps/auth` — login, register, OTP verify, forgot/reset password, MFA challenge, and OAuth redirect/callback — as a full route-handler proxy over the backend identity API, with tokens in httpOnly cookies.

**Architecture:** Every identity call goes through Next.js route handlers under `app/api/auth/...`. Handlers forward to the backend using a shared server helper (`lib/api/identity.ts`) that attaches the access-token cookie, silently refreshes via the refresh-token cookie on `401`, and stores rotated tokens back into cookies. Tokens never reach the browser; a shared-domain `session` cookie lets dashboard apps read auth state server-side. Client components call handlers via `lib/api/client.ts` and normalize errors via `lib/api/errors.ts`.

**Tech Stack:** Next.js 16.3.0 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui primitives, react-hook-form, zod, @hookform/resolvers. Package manager: bun.

## Global Constraints

- **Next.js 16 API:** `cookies()` from `next/headers` is async — always `(await cookies())`. Route-handler `context.params` is a `Promise`; Page `searchParams` prop is a `Promise`. Dynamic segment params must be awaited. Read `node_modules/next/dist/docs/` before writing route handlers/pages if unsure.
- **No tokens in the browser:** handlers that receive a token payload must set httpOnly cookies and return only `{ ok: true }` (plus `user_id` for login). Never forward `access_token`/`refresh_token` in a route-handler response body.
- **Base URL single source:** every backend URL goes through `identityUrl(path)` in `lib/api/url.ts`, which reads `IDENTITY_API_URL` from `lib/config/env.ts`. No hardcoded base URLs or paths anywhere else.
- **Cookie names:** `access_token`, `refresh_token`, `session` — defined once in `lib/api/cookies.ts` (`COOKIE_NAMES`).
- **zod rules mirror the API exactly:** password min 8; OTP exactly `\d{6}`; full_name max 255; phone max 20; email valid + max 255; identifier max 255.
- **Out of scope (do NOT implement):** logout, MFA enable/confirm/disable/recovery-codes, sessions list/revoke. Do not import from any package outside `apps/auth` (no `@cbc/*`).
- **Env vars** (all optional, with code defaults): `IDENTITY_API_URL`, `AUTH_SUCCESS_REDIRECT` / `NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT`, `SESSION_COOKIE_DOMAIN`, `NEXT_PUBLIC_DEFAULT_TENANT_ID`.
- **Verification:** no test framework this branch. Every task ends with `bun run lint` and `bun run build` (from `apps/auth`); both must pass.

---

## File Structure

```
apps/auth/
  .env.local                                   (create, gitignored)
  lib/config/env.ts                            env vars + defaults
  lib/api/url.ts                               identityUrl(path)
  lib/api/guards.ts                            isTokenResponse, isMfaRequired + types
  lib/api/errors.ts                            ApiError + parseErrorResponse
  lib/api/cookies.ts                           get/set/clear token cookies
  lib/api/identity.ts                          proxyIdentity() with silent refresh
  lib/api/client.ts                            apiRequest<T>() browser helper
  lib/schemas/index.ts                         zod schemas + input types
  lib/auth/use-auth.ts                         useAuth() client hook
  components/ui/*                              shadcn button, input, label, card
  components/auth/LoginForm.tsx
  components/auth/RegisterForm.tsx
  components/auth/OtpVerifyForm.tsx
  components/auth/ForgotPasswordForm.tsx
  components/auth/ResetPasswordForm.tsx
  components/auth/MfaChallengeForm.tsx
  components/auth/OAuthCallbackForm.tsx
  app/api/auth/login/route.ts
  app/api/auth/register/route.ts
  app/api/auth/otp-verify/route.ts
  app/api/auth/otp-resend/route.ts
  app/api/auth/forgot-password/route.ts
  app/api/auth/reset-password/route.ts
  app/api/auth/mfa-challenge/route.ts
  app/api/auth/oauth-redirect/route.ts
  app/api/auth/oauth-callback/route.ts
  app/api/auth/refresh/route.ts
  app/api/auth/session/route.ts
  app/login/page.tsx
  app/register/page.tsx
  app/verify-otp/page.tsx
  app/forgot-password/page.tsx
  app/reset-password/page.tsx
  app/mfa-challenge/page.tsx
  app/oauth/[provider]/page.tsx
  app/oauth/[provider]/callback/page.tsx
```

---

### Task 1: Install dependencies + shadcn UI primitives

**Files:**
- Modify: `apps/auth/package.json` (via bun add)
- Create: `apps/auth/components/ui/button.tsx`, `input.tsx`, `label.tsx`, `card.tsx` (via shadcn)

**Interfaces:**
- Produces: `@/components/ui/{button,input,label,card}` — standard shadcn components with `cn` from `@/lib/utils`, usable from client components.

- [ ] **Step 1: Add runtime dependencies**

Run in `apps/auth`:
```bash
bun add zod react-hook-form @hookform/resolvers
```
Expected: package.json gains `zod`, `react-hook-form`, `@hookform/resolvers`.

- [ ] **Step 2: Add shadcn components**

Run in `apps/auth`:
```bash
node node_modules/shadcn/dist/index.js add button input label card --yes
```
Expected: creates `components/ui/button.tsx`, `input.tsx`, `label.tsx`, `card.tsx`. (The `shadcn` package is already a dependency; `node node_modules/shadcn/dist/index.js` is its local CLI.)

- [ ] **Step 3: Verify**

```bash
bun run lint
bun run build
```
Expected: lint clean, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A apps/auth
git commit -m "chore(auth): add react-hook-form, zod, shadcn ui primitives"
```

---

### Task 2: Env config + URL utility

**Files:**
- Create: `apps/auth/lib/config/env.ts`
- Create: `apps/auth/lib/api/url.ts`
- Create: `apps/auth/.env.local`

**Interfaces:**
- Produces: `IDENTITY_API_URL: string`, `AUTH_SUCCESS_REDIRECT: string`, `NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT: string`, `SESSION_COOKIE_DOMAIN: string | undefined`, `NEXT_PUBLIC_DEFAULT_TENANT_ID: string | undefined` — exported from `@/lib/config/env`.
- Produces: `identityUrl(path: string): string` — exported from `@/lib/api/url`.

- [ ] **Step 1: Create `lib/config/env.ts`**

```ts
export const IDENTITY_API_URL =
  process.env.IDENTITY_API_URL ?? "http://localhost:8000/api/v1";

export const AUTH_SUCCESS_REDIRECT =
  process.env.AUTH_SUCCESS_REDIRECT ?? process.env.NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT ?? "/";

export const NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT =
  process.env.NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT ?? "/";

export const SESSION_COOKIE_DOMAIN = process.env.SESSION_COOKIE_DOMAIN;

export const NEXT_PUBLIC_DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID;
```

- [ ] **Step 2: Create `lib/api/url.ts`**

```ts
import { IDENTITY_API_URL } from "@/lib/config/env";

export function identityUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`identityUrl expects a path starting with "/", got: ${path}`);
  }
  return `${IDENTITY_API_URL}${path}`;
}
```

- [ ] **Step 3: Create `.env.local`**

```bash
IDENTITY_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT=/
# SESSION_COOKIE_DOMAIN=.yourdomain.com
# NEXT_PUBLIC_DEFAULT_TENANT_ID=<uuid>
```

- [ ] **Step 4: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): env config and identity URL builder"
```

---

### Task 3: Zod schemas

**Files:**
- Create: `apps/auth/lib/schemas/index.ts`

**Interfaces:**
- Produces (each schema + inferred input type):
  - `loginSchema` / `LoginInput` — `{ identifier, password }`
  - `registerSchema` / `RegisterInput` — `{ full_name, phone, email, password, password_confirmation, primary_role? }`
  - `otpSchema` / `OtpInput` — `{ code, purpose }`
  - `forgotPasswordSchema` / `ForgotPasswordInput` — `{ email }`
  - `resetPasswordSchema` / `ResetPasswordInput` — `{ email, otp, password, password_confirmation }`
  - `mfaChallengeSchema` / `MfaChallengeInput` — `{ mfa_token, code, device_label? }`

- [ ] **Step 1: Create `lib/schemas/index.ts`**

```ts
import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1).max(255),
  password: z.string().min(8),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z.string().min(1).max(255),
    phone: z.string().min(1).max(20),
    email: z.string().email().max(255),
    password: z.string().min(8),
    password_confirmation: z.string().min(1),
    primary_role: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Code must be exactly 6 digits."),
  purpose: z.enum(["email_verification", "password_reset", "two_factor_auth"]),
});
export type OtpInput = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().regex(/^\d{6}$/, "Code must be exactly 6 digits."),
    password: z.string().min(8),
    password_confirmation: z.string().min(1),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const mfaChallengeSchema = z.object({
  mfa_token: z.string().min(1),
  code: z.string().min(1),
  device_label: z.string().max(255).optional(),
});
export type MfaChallengeInput = z.infer<typeof mfaChallengeSchema>;
```

- [ ] **Step 2: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): zod schemas mirroring identity API rules"
```

---

### Task 4: Response guards + error normalization

**Files:**
- Create: `apps/auth/lib/api/guards.ts`
- Create: `apps/auth/lib/api/errors.ts`

**Interfaces:**
- Produces: `isTokenResponse(body: unknown): body is TokenResponse`, `isMfaRequired(body: unknown): body is MfaRequiredBody`, types `TokenData`, `TokenResponse`, `MfaRequiredBody` from `@/lib/api/guards`.
- Produces: `class ApiError extends Error` (fields `status`, `code`, `message`, `fieldErrors`, `retryAfter`, `lockedUntil`) and `parseErrorResponse(status: number, body: unknown): ApiError` from `@/lib/api/errors`.

- [ ] **Step 1: Create `lib/api/guards.ts`**

```ts
export interface TokenData {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  user_id: string;
}

export interface TokenResponse {
  data: TokenData;
}

export interface MfaRequiredBody {
  mfa_required: true;
  mfa_token: string;
  message?: string;
}

export function isTokenResponse(body: unknown): body is TokenResponse {
  const candidate = body as TokenResponse | null;
  return (
    !!candidate &&
    typeof candidate.data === "object" &&
    candidate.data !== null &&
    typeof candidate.data.access_token === "string" &&
    typeof candidate.data.refresh_token === "string"
  );
}

export function isMfaRequired(body: unknown): body is MfaRequiredBody {
  const candidate = body as MfaRequiredBody | null;
  return (
    !!candidate &&
    candidate.mfa_required === true &&
    typeof candidate.mfa_token === "string"
  );
}
```

- [ ] **Step 2: Create `lib/api/errors.ts`**

```ts
interface ErrorBody {
  message?: string;
  error?: string;
  error_code?: string;
  title?: string;
  errors?: Record<string, string[]>;
  retry_after?: number;
  locked_until?: string;
}

export class ApiError extends Error {
  status: number;
  code: string | null;
  fieldErrors: Record<string, string[]>;
  retryAfter?: number;
  lockedUntil?: string;

  constructor(
    status: number,
    message: string,
    code: string | null = null,
    fieldErrors: Record<string, string[]> = {},
    retryAfter?: number,
    lockedUntil?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.retryAfter = retryAfter;
    this.lockedUntil = lockedUntil;
  }
}

export function parseErrorResponse(status: number, body: unknown): ApiError {
  const candidate = (body ?? {}) as ErrorBody;

  // RFC 7807 problem+json
  if (candidate.error_code && candidate.title) {
    return new ApiError(status, candidate.title, candidate.error_code, {}, candidate.retry_after, candidate.locked_until);
  }

  // 422 validation — field errors
  if (status === 422 && candidate.errors && typeof candidate.errors === "object") {
    return new ApiError(
      status,
      candidate.message ?? "The given data was invalid.",
      "VALIDATION_ERROR",
      candidate.errors
    );
  }

  // business error { error, message }
  if (candidate.error && typeof candidate.error === "string") {
    return new ApiError(
      status,
      candidate.message ?? candidate.error,
      candidate.error,
      {},
      candidate.retry_after,
      candidate.locked_until
    );
  }

  return new ApiError(status, candidate.message ?? "Request failed.", null, {}, candidate.retry_after, candidate.locked_until);
}
```

- [ ] **Step 3: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): api response guards and error normalization"
```

---

### Task 5: Cookie helpers

**Files:**
- Create: `apps/auth/lib/api/cookies.ts`

**Interfaces:**
- Consumes: `SESSION_COOKIE_DOMAIN` from `@/lib/config/env`.
- Produces: `COOKIE_NAMES` (`access_token`, `refresh_token`, `session`), `getAccessToken(): Promise<string | undefined>`, `getRefreshToken(): Promise<string | undefined>`, `getSessionUserId(): Promise<string | undefined>`, `setAuthCookies(data: TokenData): Promise<void>`, `clearAuthCookies(): Promise<void>` from `@/lib/api/cookies`.

- [ ] **Step 1: Create `lib/api/cookies.ts`**

```ts
import { cookies } from "next/headers";
import { SESSION_COOKIE_DOMAIN } from "@/lib/config/env";
import type { TokenData } from "./guards";

export const COOKIE_NAMES = {
  access: "access_token",
  refresh: "refresh_token",
  session: "session",
} as const;

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_NAMES.access)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_NAMES.refresh)?.value;
}

export async function getSessionUserId(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_NAMES.session)?.value;
}

export async function setAuthCookies(data: TokenData): Promise<void> {
  const store = await cookies();
  const base = {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  store.set(COOKIE_NAMES.access, data.access_token, {
    ...base,
    maxAge: data.expires_in ?? 900,
  });
  store.set(COOKIE_NAMES.refresh, data.refresh_token, {
    ...base,
    maxAge: 30 * 24 * 60 * 60,
  });
  store.set(COOKIE_NAMES.session, data.user_id, {
    ...base,
    maxAge: 30 * 24 * 60 * 60,
    ...(SESSION_COOKIE_DOMAIN ? { domain: SESSION_COOKIE_DOMAIN } : {}),
  });
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAMES.access);
  store.delete(COOKIE_NAMES.refresh);
  store.delete(COOKIE_NAMES.session);
}
```

- [ ] **Step 2: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): httpOnly token cookie helpers"
```

---

### Task 6: Server proxy helper with silent refresh

**Files:**
- Create: `apps/auth/lib/api/identity.ts`

**Interfaces:**
- Consumes: `identityUrl` from `@/lib/api/url`, `getAccessToken`, `getRefreshToken`, `setAuthCookies`, `clearAuthCookies` from `@/lib/api/cookies`, `isTokenResponse` from `@/lib/api/guards`.
- Produces: `proxyIdentity(path: string, options?: { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown; attachAccessToken?: boolean; retryOn401?: boolean }): Promise<{ status: number; body: unknown }>` from `@/lib/api/identity`.

- [ ] **Step 1: Create `lib/api/identity.ts`**

```ts
import { identityUrl } from "./url";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "./cookies";
import { isTokenResponse } from "./guards";

interface ProxyOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  attachAccessToken?: boolean;
  retryOn401?: boolean;
}

interface IdentityResult {
  status: number;
  body: unknown;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  const response = await fetch(identityUrl("/identity/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) {
    await clearAuthCookies();
    return false;
  }

  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!isTokenResponse(body)) {
    await clearAuthCookies();
    return false;
  }

  await setAuthCookies(body.data);
  return true;
}

export async function proxyIdentity(
  path: string,
  options: ProxyOptions = {}
): Promise<IdentityResult> {
  const {
    method = "GET",
    body,
    attachAccessToken = true,
    retryOn401 = true,
  } = options;

  const call = async (): Promise<IdentityResult> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (attachAccessToken) {
      const accessToken = await getAccessToken();
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(identityUrl(path), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });

    const text = await response.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }
    return { status: response.status, body: parsed };
  };

  const first = await call();
  if (first.status === 401 && retryOn401 && attachAccessToken) {
    const refreshed = await tryRefresh();
    if (refreshed) return call();
  }
  return first;
}
```

- [ ] **Step 2: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): server identity proxy with silent token refresh"
```

---

### Task 7: Client request helper

**Files:**
- Create: `apps/auth/lib/api/client.ts`

**Interfaces:**
- Consumes: `ApiError`, `parseErrorResponse` from `@/lib/api/errors`.
- Produces: `apiRequest<T>(path: string, options?: { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown }): Promise<T>` from `@/lib/api/client`. On `!response.ok` it throws `ApiError` (and, when the server responds `401` with a body that itself signals the session expired, throws a `ApiError` with status 401 so the page can route to login).

- [ ] **Step 1: Create `lib/api/client.ts`**

```ts
import { parseErrorResponse } from "./errors";

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = "GET", body } = options;

  const response = await fetch(path, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (!response.ok) {
    throw parseErrorResponse(response.status, parsed);
  }

  return parsed as T;
}
```

- [ ] **Step 2: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): client api helper with normalized errors"
```

---

### Task 8: Auth route handlers — login, register

**Files:**
- Create: `apps/auth/app/api/auth/login/route.ts`
- Create: `apps/auth/app/api/auth/register/route.ts`

**Interfaces:**
- Consumes: `proxyIdentity` from `@/lib/api/identity`, `setAuthCookies`, `clearAuthCookies` from `@/lib/api/cookies`, `isTokenResponse`, `isMfaRequired` from `@/lib/api/guards`, `parseErrorResponse` from `@/lib/api/errors`, `loginSchema` / `registerSchema` from `@/lib/schemas`.
- Produces:
  - `POST /api/auth/login` → body `{ identifier, password }` (validated). Response:
    - `200` `{ ok: true, user_id }` with auth cookies set
    - `202` `{ ok: true, mfa_required: true, mfa_token }` when the API says MFA is required (no cookies set)
    - `401` `{ error: "invalid_credentials", message }` (or `locked` etc.) on failure
    - `422` `{ message, errors }` on validation failure
  - `POST /api/auth/register` → body `{ full_name, phone, email, password, password_confirmation, primary_role? }` (validated). Response:
    - `200` `{ ok: true, user_id }` with auth cookies set (auto-login)
    - `202` `{ ok: true, otp_required: true, email }` when email verification is pending (no cookies set)
    - `422` `{ message, errors }` on validation failure

- [ ] **Step 1: Create `app/api/auth/login/route.ts`**

```ts
import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { setAuthCookies, clearAuthCookies } from "@/lib/api/cookies";
import { isTokenResponse, isMfaRequired } from "@/lib/api/guards";
import { parseErrorResponse } from "@/lib/api/errors";
import { loginSchema } from "@/lib/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { status, body } = await proxyIdentity("/identity/login", {
    method: "POST",
    body: parsed.data,
    attachAccessToken: false,
    retryOn401: false,
  });

  if (isMfaRequired(body)) {
    return NextResponse.json(
      { ok: true, mfa_required: true, mfa_token: body.mfa_token },
      { status: 202 }
    );
  }

  if (status === 200 && isTokenResponse(body)) {
    await setAuthCookies(body.data);
    return NextResponse.json({ ok: true, user_id: body.data.user_id }, { status: 200 });
  }

  await clearAuthCookies();
  const error = parseErrorResponse(status, body);
  return NextResponse.json(
    { error: error.code, message: error.message, ...(error.lockedUntil ? { locked_until: error.lockedUntil } : {}) },
    { status: status }
  );
}
```

- [ ] **Step 2: Create `app/api/auth/register/route.ts`**

```ts
import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { setAuthCookies, clearAuthCookies } from "@/lib/api/cookies";
import { isTokenResponse } from "@/lib/api/guards";
import { parseErrorResponse } from "@/lib/api/errors";
import { registerSchema } from "@/lib/schemas";

interface RegisterSuccessBody {
  data: { user_id: string };
  message?: string;
}

interface RegisterOtpRequiredBody {
  otp_required: true;
  email: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { status, body } = await proxyIdentity("/identity/register", {
    method: "POST",
    body: parsed.data,
    attachAccessToken: false,
    retryOn401: false,
  });

  if (status === 200 && isTokenResponse(body)) {
    await setAuthCookies(body.data);
    return NextResponse.json({ ok: true, user_id: body.data.user_id }, { status: 200 });
  }

  const candidate = body as RegisterOtpRequiredBody | null;
  if (candidate?.otp_required === true && typeof candidate.email === "string") {
    return NextResponse.json({ ok: true, otp_required: true, email: candidate.email }, { status: 202 });
  }

  await clearAuthCookies();
  const error = parseErrorResponse(status, body);
  return NextResponse.json({ error: error.code, message: error.message }, { status: status });
}
```

- [ ] **Step 3: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): login and register route handlers"
```

---

### Task 9: Auth route handlers — OTP + password reset

**Files:**
- Create: `apps/auth/app/api/auth/otp-verify/route.ts`
- Create: `apps/auth/app/api/auth/otp-resend/route.ts`
- Create: `apps/auth/app/api/auth/forgot-password/route.ts`
- Create: `apps/auth/app/api/auth/reset-password/route.ts`

**Interfaces:**
- Consumes: `proxyIdentity` from `@/lib/api/identity`, `setAuthCookies`, `clearAuthCookies` from `@/lib/api/cookies`, `isTokenResponse`, `isMfaRequired` from `@/lib/api/guards`, `parseErrorResponse` from `@/lib/api/errors`, zod schemas from `@/lib/schemas`.
- Produces:
  - `POST /api/auth/otp-verify` body `{ code, purpose, email?, mfa_token? }` →
    - `200` `{ ok: true, user_id }` with auth cookies set (for email_verification or password_reset purposes that yield tokens)
    - `202` `{ ok: true, mfa_required: true, mfa_token }` when MFA is required after OTP
    - `422` on invalid code
  - `POST /api/auth/otp-resend` body `{ email, purpose }` → `200` `{ ok: true }`
  - `POST /api/auth/forgot-password` body `{ email }` → `200` `{ ok: true }` (always succeeds; no user enumeration)
  - `POST /api/auth/reset-password` body `{ email, otp, password, password_confirmation }` → `200` `{ ok: true }` with auth cookies set (auto-login after reset)

- [ ] **Step 1: Create `app/api/auth/otp-verify/route.ts`**

```ts
import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { setAuthCookies, clearAuthCookies } from "@/lib/api/cookies";
import { isTokenResponse, isMfaRequired } from "@/lib/api/guards";
import { parseErrorResponse } from "@/lib/api/errors";
import { otpSchema } from "@/lib/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = otpSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { status, body } = await proxyIdentity("/identity/otp/verify", {
    method: "POST",
    body: parsed.data,
    attachAccessToken: false,
    retryOn401: false,
  });

  if (isMfaRequired(body)) {
    return NextResponse.json({ ok: true, mfa_required: true, mfa_token: body.mfa_token }, { status: 202 });
  }

  if (status === 200 && isTokenResponse(body)) {
    await setAuthCookies(body.data);
    return NextResponse.json({ ok: true, user_id: body.data.user_id }, { status: 200 });
  }

  if (status === 200) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  await clearAuthCookies();
  const error = parseErrorResponse(status, body);
  return NextResponse.json({ error: error.code, message: error.message }, { status });
}
```

- [ ] **Step 2: Create `app/api/auth/otp-resend/route.ts`**

```ts
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
```

- [ ] **Step 3: Create `app/api/auth/forgot-password/route.ts`**

```ts
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
```

- [ ] **Step 4: Create `app/api/auth/reset-password/route.ts`**

```ts
import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { setAuthCookies, clearAuthCookies } from "@/lib/api/cookies";
import { isTokenResponse } from "@/lib/api/guards";
import { parseErrorResponse } from "@/lib/api/errors";
import { resetPasswordSchema } from "@/lib/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = resetPasswordSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { status, body } = await proxyIdentity("/identity/reset-password", {
    method: "POST",
    body: parsed.data,
    attachAccessToken: false,
    retryOn401: false,
  });

  if (status === 200 && isTokenResponse(body)) {
    await setAuthCookies(body.data);
    return NextResponse.json({ ok: true, user_id: body.data.user_id }, { status: 200 });
  }

  await clearAuthCookies();
  const error = parseErrorResponse(status, body);
  return NextResponse.json({ error: error.code, message: error.message }, { status });
}
```

- [ ] **Step 5: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): otp, forgot-password, reset-password route handlers"
```

---

### Task 10: Auth route handlers — MFA + OAuth + refresh + session

**Files:**
- Create: `apps/auth/app/api/auth/mfa-challenge/route.ts`
- Create: `apps/auth/app/api/auth/oauth-redirect/route.ts`
- Create: `apps/auth/app/api/auth/oauth-callback/route.ts`
- Create: `apps/auth/app/api/auth/refresh/route.ts`
- Create: `apps/auth/app/api/auth/session/route.ts`

**Interfaces:**
- Consumes: `proxyIdentity`, cookie helpers, guards, `parseErrorResponse`, schemas.
- Produces:
  - `POST /api/auth/mfa-challenge` body `{ mfa_token, code, device_label? }` → `200` `{ ok: true, user_id }` with auth cookies set; `422`/`401` on failure.
  - `POST /api/auth/oauth-redirect` body `{ provider, tenant_id? }` → `200` `{ redirect_url }`.
  - `POST /api/auth/oauth-callback` body `{ provider, code, tenant_id? }` →
    - `200` `{ ok: true, user_id }` with auth cookies set
    - `202` `{ ok: true, mfa_required: true, mfa_token }`
    - `422`/`400` on failure
  - `POST /api/auth/refresh` → `200` `{ ok: true }` on success (cookies rotated), `401` `{ ok: false, message }` when the refresh token is absent/expired (cookies cleared).
  - `GET /api/auth/session` → `200` `{ ok: true, authenticated: boolean, user_id?: string }`.

- [ ] **Step 1: Create `app/api/auth/mfa-challenge/route.ts`**

```ts
import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { setAuthCookies, clearAuthCookies } from "@/lib/api/cookies";
import { isTokenResponse } from "@/lib/api/guards";
import { parseErrorResponse } from "@/lib/api/errors";
import { mfaChallengeSchema } from "@/lib/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = mfaChallengeSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { status, body } = await proxyIdentity("/identity/mfa/challenge", {
    method: "POST",
    body: parsed.data,
    attachAccessToken: false,
    retryOn401: false,
  });

  if (status === 200 && isTokenResponse(body)) {
    await setAuthCookies(body.data);
    return NextResponse.json({ ok: true, user_id: body.data.user_id }, { status: 200 });
  }

  await clearAuthCookies();
  const error = parseErrorResponse(status, body);
  return NextResponse.json({ error: error.code, message: error.message }, { status });
}
```

- [ ] **Step 2: Create `app/api/auth/oauth-redirect/route.ts`**

```ts
import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { parseErrorResponse } from "@/lib/api/errors";
import { z } from "zod";

const oauthRedirectSchema = z.object({
  provider: z.string().min(1),
  tenant_id: z.string().optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = oauthRedirectSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { status, body } = await proxyIdentity("/identity/oauth/redirect", {
    method: "POST",
    body: parsed.data,
    attachAccessToken: false,
    retryOn401: false,
  });

  const candidate = body as { redirect_url?: string } | null;
  if (status === 200 && typeof candidate?.redirect_url === "string") {
    return NextResponse.json({ redirect_url: candidate.redirect_url }, { status: 200 });
  }

  const error = parseErrorResponse(status, body);
  return NextResponse.json({ error: error.code, message: error.message }, { status });
}
```

- [ ] **Step 3: Create `app/api/auth/oauth-callback/route.ts`**

```ts
import { NextResponse } from "next/server";
import { proxyIdentity } from "@/lib/api/identity";
import { setAuthCookies, clearAuthCookies } from "@/lib/api/cookies";
import { isTokenResponse, isMfaRequired } from "@/lib/api/guards";
import { parseErrorResponse } from "@/lib/api/errors";
import { z } from "zod";

const oauthCallbackSchema = z.object({
  provider: z.string().min(1),
  code: z.string().min(1),
  tenant_id: z.string().optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = oauthCallbackSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { status, body } = await proxyIdentity("/identity/oauth/callback", {
    method: "POST",
    body: parsed.data,
    attachAccessToken: false,
    retryOn401: false,
  });

  if (isMfaRequired(body)) {
    return NextResponse.json({ ok: true, mfa_required: true, mfa_token: body.mfa_token }, { status: 202 });
  }

  if (status === 200 && isTokenResponse(body)) {
    await setAuthCookies(body.data);
    return NextResponse.json({ ok: true, user_id: body.data.user_id }, { status: 200 });
  }

  await clearAuthCookies();
  const error = parseErrorResponse(status, body);
  return NextResponse.json({ error: error.code, message: error.message }, { status });
}
```

- [ ] **Step 4: Create `app/api/auth/refresh/route.ts`**

```ts
import { NextResponse } from "next/server";
import { getRefreshToken, clearAuthCookies } from "@/lib/api/cookies";
import { identityUrl } from "@/lib/api/url";
import { isTokenResponse } from "@/lib/api/guards";
import { setAuthCookies } from "@/lib/api/cookies";

export async function POST(): Promise<NextResponse> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearAuthCookies();
    return NextResponse.json({ ok: false, message: "No refresh token." }, { status: 401 });
  }

  const response = await fetch(identityUrl("/identity/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok || !isTokenResponse(body)) {
    await clearAuthCookies();
    return NextResponse.json({ ok: false, message: "Session expired." }, { status: 401 });
  }

  await setAuthCookies(body.data);
  return NextResponse.json({ ok: true }, { status: 200 });
}
```

- [ ] **Step 5: Create `app/api/auth/session/route.ts`**

```ts
import { NextResponse } from "next/server";
import { getAccessToken, getSessionUserId } from "@/lib/api/cookies";

export async function GET(): Promise<NextResponse> {
  const accessToken = await getAccessToken();
  const userId = await getSessionUserId();

  return NextResponse.json(
    {
      ok: true,
      authenticated: !!accessToken,
      user_id: userId,
    },
    { status: 200 }
  );
}
```

- [ ] **Step 6: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): mfa, oauth, refresh, session route handlers"
```

---

### Task 11: Client auth hook + shared form pieces

**Files:**
- Create: `apps/auth/lib/auth/use-auth.ts`
- Create: `apps/auth/components/auth/shared.tsx` (small shared bits: `ErrorAlert`, `SuccessAlert`, `passwordVisible` toggle, `AuthCardShell`)

**Interfaces:**
- Consumes: `apiRequest` from `@/lib/api/client`, `ApiError` from `@/lib/api/errors`.
- Produces:
  - `useAuth(): { authenticated: boolean | null; userId: string | null; loading: boolean; refresh(): Promise<void> }` — calls `GET /api/auth/session` on mount; `authenticated` is `null` while the initial fetch is in flight.
  - `AuthCardShell({ title, description, children, footer })` — centered card layout.
  - `ErrorAlert({ error: ApiError | string | null })` — renders field errors + summary.
  - `SuccessAlert({ children })`.
  - `PasswordInput({ label, error, ...field })` — forwardRef password field with visibility toggle; spread a react-hook-form `register(...)` result into it.

- [ ] **Step 1: Create `lib/auth/use-auth.ts`**

```ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";

interface SessionResponse {
  ok: boolean;
  authenticated: boolean;
  user_id?: string;
}

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const session = await apiRequest<SessionResponse>("/api/auth/session");
      setAuthenticated(session.authenticated);
      setUserId(session.user_id ?? null);
    } catch {
      setAuthenticated(false);
      setUserId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { authenticated, userId, loading, refresh };
}
```

- [ ] **Step 2: Create `components/auth/shared.tsx`**

```tsx
"use client";

import { forwardRef, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { ApiError } from "@/lib/api/errors";

export function ErrorAlert({ error }: { error: ApiError | string | null }) {
  if (!error) return null;
  const message = typeof error === "string" ? error : error.message;

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
      <p className="font-medium">{message}</p>
      {typeof error !== "string" && Object.keys(error.fieldErrors ?? {}).length > 0 && (
        <ul className="mt-2 list-inside list-disc text-xs">
          {Object.entries(error.fieldErrors).map(([field, messages]) =>
            messages.map((m, i) => <li key={`${field}-${i}`}>{field}: {m}</li>)
          )}
        </ul>
      )}
    </div>
  );
}

export function SuccessAlert({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
      {children}
    </div>
  );
}

export function AuthCardShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer ? <div className="border-t px-6 py-4 text-center text-sm">{footer}</div> : null}
      </Card>
    </div>
  );
}

export const PasswordInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<typeof Input> & { label: string; error?: string }
>(function PasswordInput({ label, error, id, ...props }, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input ref={ref} id={id} type={visible ? "text" : "password"} aria-invalid={!!error} {...props} />
      <button type="button" onClick={() => setVisible((v) => !v)} className="text-xs underline">
        {visible ? "Hide" : "Show"}
      </button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
});
```

- [ ] **Step 3: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): useAuth hook and shared form components"
```

---

### Task 12: Login page + form

**Files:**
- Create: `apps/auth/app/login/page.tsx`
- Create: `apps/auth/components/auth/LoginForm.tsx`

**Behavior:**
- `GET /login` renders the login form; reads `?next=` query (validated: must start with `/` and not `//`) and passes it as `returnTo` to the form. If the user is already authenticated, server redirects to the success redirect.
- Submit → `POST /api/auth/login`.
  - `200` → client `router.replace(returnTo ?? NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT)` (or full `window.location.assign` to cross-origin shared domain).
  - `202 mfa_required` → `router.push(`/mfa-challenge?mfa_token=${token}`)`.
  - `401` → show error (invalid credentials / account locked with countdown from `locked_until`).
  - `422` → show field errors.

- [ ] **Step 1: Create `app/login/page.tsx`**

```tsx
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
    typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : undefined;

  return (
    <main className="container mx-auto">
      <Suspense>
        <LoginForm returnTo={returnTo} />
      </Suspense>
    </main>
  );
}

export default LoginPage;
```

- [ ] **Step 2: Create `components/auth/LoginForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardShell, ErrorAlert, PasswordInput } from "./shared";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import Link from "next/link";

interface LoginResponse {
  ok: true;
  user_id?: string;
  mfa_required?: boolean;
  mfa_token?: string;
}

export function LoginForm({ returnTo }: { returnTo?: string }) {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiRequest<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: values,
      });
      if (res.mfa_required && res.mfa_token) {
        router.push(`/mfa-challenge?mfa_token=${encodeURIComponent(res.mfa_token)}`);
        return;
      }
      const destination = returnTo ?? NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT;
      window.location.assign(destination);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCardShell
      title="Sign in"
      description="Enter your email or phone and password."
      footer={
        <div className="space-y-1">
          <Link href="/forgot-password" className="hover:underline">Forgot password?</Link>
          <div>No account? <Link href="/register" className="hover:underline">Register</Link></div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ErrorAlert error={error} />
        <div className="space-y-2">
          <Label htmlFor="identifier">Email or phone</Label>
          <Input id="identifier" {...register("identifier")} aria-invalid={!!errors.identifier} />
          {errors.identifier ? <p className="text-xs text-destructive">{errors.identifier.message}</p> : null}
        </div>
        <PasswordInput id="password" label="Password" error={errors.password?.message} {...register("password")} />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCardShell>
  );
}
```

- [ ] **Step 3: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): login page and form"
```

---

### Task 13: Register page + form

**Files:**
- Create: `apps/auth/app/register/page.tsx`
- Create: `apps/auth/components/auth/RegisterForm.tsx`

**Behavior:**
- `GET /register` → if already authenticated, redirect to success redirect.
- Submit → `POST /api/auth/register`.
  - `200` → redirect to success redirect (auto-login).
  - `202 otp_required` → `router.push(`/verify-otp?email=${email}&purpose=email_verification`)`.
  - `422` → show field errors.

- [ ] **Step 1: Create `app/register/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `components/auth/RegisterForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardShell, ErrorAlert, PasswordInput } from "./shared";
import { registerSchema, type RegisterInput } from "@/lib/schemas";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import Link from "next/link";

interface RegisterResponse {
  ok: true;
  user_id?: string;
  otp_required?: boolean;
  email?: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: "", phone: "", email: "", password: "", password_confirmation: "" },
  });

  const onSubmit = async (values: RegisterInput) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiRequest<RegisterResponse>("/api/auth/register", { method: "POST", body: values });
      if (res.otp_required && res.email) {
        router.push(`/verify-otp?email=${encodeURIComponent(res.email)}&purpose=email_verification`);
        return;
      }
      window.location.assign(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCardShell
      title="Create account"
      footer={<div>Already have an account? <Link href="/login" className="hover:underline">Sign in</Link></div>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ErrorAlert error={error} />
        <div className="space-y-2">
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" {...register("full_name")} aria-invalid={!!errors.full_name} />
          {errors.full_name ? <p className="text-xs text-destructive">{errors.full_name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" {...register("phone")} aria-invalid={!!errors.phone} />
          {errors.phone ? <p className="text-xs text-destructive">{errors.phone.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
        <PasswordInput id="password" label="Password" error={errors.password?.message} {...register("password")} />
        <PasswordInput id="password_confirmation" label="Confirm password" error={errors.password_confirmation?.message} {...register("password_confirmation")} />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Creating…" : "Create account"}
        </Button>
      </form>
    </AuthCardShell>
  );
}
```

- [ ] **Step 3: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): register page and form"
```

---

### Task 14: Verify OTP page + form

**Files:**
- Create: `apps/auth/app/verify-otp/page.tsx`
- Create: `apps/auth/components/auth/OtpVerifyForm.tsx`

**Behavior:**
- `GET /verify-otp?email=...&purpose=email_verification|password_reset` (email optional). Form has a single 6-digit code input + resend button.
- Submit → `POST /api/auth/otp-verify` with `{ code, purpose, email }`.
  - `200` (with tokens) → redirect to success redirect (email verified / auto-login).
  - `200` `{ ok: true }` only → stay and show success (for password_reset used alone).
  - `202 mfa_required` → push to `/mfa-challenge?mfa_token=...`.
  - `422` → show error.
- Resend → `POST /api/auth/otp-resend` with `{ email, purpose }` → success toast + 60s countdown.

- [ ] **Step 1: Create `app/verify-otp/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `components/auth/OtpVerifyForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardShell, ErrorAlert, SuccessAlert } from "./shared";
import { otpSchema, type OtpInput } from "@/lib/schemas";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import Link from "next/link";

interface OtpVerifyResponse {
  ok: true;
  user_id?: string;
  mfa_required?: boolean;
  mfa_token?: string;
}

export function OtpVerifyForm({
  email,
  purpose,
}: {
  email?: string;
  purpose: "email_verification" | "password_reset";
}) {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "", purpose },
  });

  const onSubmit = async (values: OtpInput) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await apiRequest<OtpVerifyResponse>("/api/auth/otp-verify", {
        method: "POST",
        body: { ...values, email },
      });
      if (res.mfa_required && res.mfa_token) {
        router.push(`/mfa-challenge?mfa_token=${encodeURIComponent(res.mfa_token)}`);
        return;
      }
      if (res.user_id) {
        window.location.assign(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);
        return;
      }
      setSuccess("Code verified.");
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      await apiRequest<{ ok: true }>("/api/auth/otp-resend", { method: "POST", body: { email, purpose } });
      setSuccess("A new code was sent.");
      setCountdown(60);
      const timer = setInterval(() => setCountdown((c) => (c <= 1 ? (clearInterval(timer), 0) : c - 1)), 1000);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthCardShell
      title="Verify code"
      description={`Enter the 6-digit code sent to ${email ?? "you"}.`}
      footer={
        <Link href="/login" className="hover:underline">Back to sign in</Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ErrorAlert error={error} />
        {success ? <SuccessAlert>{success}</SuccessAlert> : null}
        <div className="space-y-2">
          <Label htmlFor="code">6-digit code</Label>
          <Input id="code" inputMode="numeric" maxLength={6} placeholder="000000" {...register("code")} aria-invalid={!!errors.code} />
          {errors.code ? <p className="text-xs text-destructive">{errors.code.message}</p> : null}
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Verifying…" : "Verify"}
        </Button>
        <Button type="button" variant="ghost" className="w-full" onClick={onResend} disabled={countdown > 0 || resending}>
          {countdown > 0 ? `Resend in ${countdown}s` : resending ? "Sending…" : "Resend code"}
        </Button>
      </form>
    </AuthCardShell>
  );
}
```

- [ ] **Step 3: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): otp verify page and form"
```

---

### Task 15: Forgot password page + form

**Files:**
- Create: `apps/auth/app/forgot-password/page.tsx`
- Create: `apps/auth/components/auth/ForgotPasswordForm.tsx`

**Behavior:**
- Submit → `POST /api/auth/forgot-password` with `{ email }`. Always show success ("If an account exists, a reset code was sent.") to avoid user enumeration; also render a link to `/verify-otp?email=...&purpose=password_reset` for the code entry.

- [ ] **Step 1: Create `app/forgot-password/page.tsx`**

```tsx
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

async function ForgotPasswordPage() {
  return (
    <main className="container mx-auto">
      <ForgotPasswordForm />
    </main>
  );
}

export default ForgotPasswordPage;
```

- [ ] **Step 2: Create `components/auth/ForgotPasswordForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardShell, ErrorAlert, SuccessAlert } from "./shared";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/schemas";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import Link from "next/link";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);
  const [done, setDone] = useState<false | { email: string }>(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest<{ ok: true }>("/api/auth/forgot-password", { method: "POST", body: values });
      setDone({ email: values.email });
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCardShell
      title="Forgot password"
      footer={<Link href="/login" className="hover:underline">Back to sign in</Link>}
    >
      {done ? (
        <div className="space-y-4">
          <SuccessAlert>
            If an account exists for that email, a password reset code was sent.
          </SuccessAlert>
          <Button type="button" className="w-full" onClick={() => router.push(`/verify-otp?email=${encodeURIComponent(done.email)}&purpose=password_reset`)}>
            Enter reset code
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorAlert error={error} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending…" : "Send reset code"}
          </Button>
        </form>
      )}
    </AuthCardShell>
  );
}
```

- [ ] **Step 3: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): forgot password page and form"
```

---

### Task 16: Reset password page + form

**Files:**
- Create: `apps/auth/app/reset-password/page.tsx`
- Create: `apps/auth/components/auth/ResetPasswordForm.tsx`

**Behavior:**
- `GET /reset-password?email=...&otp=...` — prefill `email` and `otp` from query (otp optional; user can enter manually).
- Submit → `POST /api/auth/reset-password` with `{ email, otp, password, password_confirmation }`.
  - `200` → redirect to success redirect (auto-login).
  - `422` → show field errors.

- [ ] **Step 1: Create `app/reset-password/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `components/auth/ResetPasswordForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardShell, ErrorAlert, PasswordInput } from "./shared";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/schemas";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import Link from "next/link";

export function ResetPasswordForm({ email, otp }: { email: string; otp: string }) {
  const [error, setError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, otp, password: "", password_confirmation: "" },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest<{ ok: true }>("/api/auth/reset-password", { method: "POST", body: values });
      window.location.assign(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCardShell
      title="Set new password"
      footer={<Link href="/login" className="hover:underline">Back to sign in</Link>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ErrorAlert error={error} />
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" readOnly={!!email} {...register("email")} aria-invalid={!!errors.email} />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="otp">Reset code</Label>
          <Input id="otp" inputMode="numeric" maxLength={6} placeholder="000000" {...register("otp")} aria-invalid={!!errors.otp} />
          {errors.otp ? <p className="text-xs text-destructive">{errors.otp.message}</p> : null}
        </div>
        <PasswordInput id="password" label="New password" error={errors.password?.message} {...register("password")} />
        <PasswordInput id="password_confirmation" label="Confirm new password" error={errors.password_confirmation?.message} {...register("password_confirmation")} />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Resetting…" : "Reset password"}
        </Button>
      </form>
    </AuthCardShell>
  );
}
```

- [ ] **Step 3: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): reset password page and form"
```

---

### Task 17: MFA challenge page + form

**Files:**
- Create: `apps/auth/app/mfa-challenge/page.tsx`
- Create: `apps/auth/components/auth/MfaChallengeForm.tsx`

**Behavior:**
- `GET /mfa-challenge?mfa_token=...` — form with single code input.
- Submit → `POST /api/auth/mfa-challenge` with `{ mfa_token, code, device_label? }`.
  - `200` → redirect to success redirect.
  - `422` → show error (bad code) with resubmit allowed.

- [ ] **Step 1: Create `app/mfa-challenge/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `components/auth/MfaChallengeForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardShell, ErrorAlert } from "./shared";
import { mfaChallengeSchema, type MfaChallengeInput } from "@/lib/schemas";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";
import Link from "next/link";

export function MfaChallengeForm({ mfaToken }: { mfaToken: string }) {
  const [error, setError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MfaChallengeInput>({
    resolver: zodResolver(mfaChallengeSchema),
    defaultValues: { mfa_token: mfaToken, code: "" },
  });

  const onSubmit = async (values: MfaChallengeInput) => {
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest<{ ok: true }>("/api/auth/mfa-challenge", { method: "POST", body: values });
      window.location.assign(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCardShell
      title="Two-factor authentication"
      description="Enter the 6-digit code from your authenticator app."
      footer={<Link href="/login" className="hover:underline">Back to sign in</Link>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ErrorAlert error={error} />
        <div className="space-y-2">
          <Label htmlFor="code">Authenticator code</Label>
          <Input id="code" inputMode="numeric" maxLength={6} placeholder="000000" {...register("code")} aria-invalid={!!errors.code} />
          {errors.code ? <p className="text-xs text-destructive">{errors.code.message}</p> : null}
        </div>
        <Button type="submit" className="w-full" disabled={submitting || !mfaToken}>
          {submitting ? "Verifying…" : "Verify"}
        </Button>
      </form>
    </AuthCardShell>
  );
}
```

- [ ] **Step 3: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): mfa challenge page and form"
```

---

### Task 18: OAuth pages

**Files:**
- Create: `apps/auth/app/oauth/[provider]/page.tsx`
- Create: `apps/auth/app/oauth/[provider]/callback/page.tsx`
- Create: `apps/auth/components/auth/OAuthCallbackForm.tsx`

**Behavior:**
- `GET /oauth/[provider]` — async **server component**. Reads `NEXT_PUBLIC_DEFAULT_TENANT_ID`, calls `proxyIdentity("/identity/oauth/redirect", ...)` directly (it is already on the server — no self-fetch, no absolute origin needed), then `redirect(redirect_url)`. On failure, render an error state with a link back to login.
- `GET /oauth/[provider]/callback` — async **server component** that reads `searchParams.code`/`searchParams.tenant_id`, then renders a client **`OAuthCallbackForm`**. The form POSTs `{ provider, code, tenant_id }` to `/api/auth/oauth-callback` **from the browser** via `apiRequest`, so the browser receives the `Set-Cookie` headers (a server-side fetch would swallow them). Then:
  - `200` → `window.location.assign(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT)`.
  - `mfa_required` + `mfa_token` → `router.replace('/mfa-challenge?mfa_token=...')`.
  - error → render error state with a link back to login.
- Both pages must `await` the `provider` param (Next 16: params is a Promise). The provider page passes `provider`, `code`, and `tenant_id` into the form as props — the form needs no `useSearchParams`/`useParams`.

> **Why client-component callback:** Next 16 only sends `Set-Cookie` to the browser on responses the browser directly receives. A server component `fetch()`-ing the oauth-callback route handler would run that handler server-to-server and the cookies would never reach the browser. Posting from the client fixes the flow.

- [ ] **Step 1: Create `app/oauth/[provider]/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `app/oauth/[provider]/callback/page.tsx`**

```tsx
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
```

- [ ] **Step 3: Create `components/auth/OAuthCallbackForm.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT } from "@/lib/config/env";

interface OAuthCallbackResponse {
  ok: true;
  user_id?: string;
  mfa_required?: boolean;
  mfa_token?: string;
}

export function OAuthCallbackForm({
  provider,
  code,
  tenant_id,
}: {
  provider: string;
  code: string;
  tenant_id?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);

  const complete = useCallback(async () => {
    try {
      const res = await apiRequest<OAuthCallbackResponse>("/api/auth/oauth-callback", {
        method: "POST",
        body: { provider, code, tenant_id },
      });
      if (res.mfa_required && res.mfa_token) {
        router.replace(`/mfa-challenge?mfa_token=${encodeURIComponent(res.mfa_token)}`);
        return;
      }
      window.location.assign(NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, "Unexpected error."));
    }
  }, [provider, code, tenant_id, router]);

  useEffect(() => {
    void complete();
  }, [complete]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      {error ? (
        <>
          <h1 className="text-lg font-semibold">Sign in failed</h1>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Link href="/login" className="text-sm underline">Back to sign in</Link>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Completing sign in…</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify**

```bash
bun run lint
bun run build
```
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add -A apps/auth
git commit -m "feat(auth): oauth provider and client callback pages"
```

---

## Verification Plan

- Per-task: `bun run lint` + `bun run build` in `apps/auth` (both must pass).
- End-to-end (manual, against a running backend at `http://localhost:8000`):
  1. `bun run dev`, open `http://localhost:3000/login`.
  2. Register a new user → expect auto-login redirect or OTP step.
  3. Log out via cookie clearing (or fresh browser) → log in → expect success redirect.
  4. Forgot password → receive code → reset → auto-login.
  5. If backend is configured for MFA, trigger MFA challenge flow.
  6. OAuth: hit `/oauth/google` → redirected to provider → callback → cookies set → redirected to success.

## Rollout / Notes

- No test framework on this branch; correctness is verified via lint/build + manual smoke test.
- The design system restyle of forms to match the landing-page look is a follow-up outside this plan.
- If the backend is unreachable during dev, expected behavior is a clean `ApiError` surfaced in the form (no crash).

