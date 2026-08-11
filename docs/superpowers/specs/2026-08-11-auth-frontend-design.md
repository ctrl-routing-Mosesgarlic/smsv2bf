# Auth Frontend Design — `apps/auth`

> Feature branch: authentication.
> Backend contract: `apps/auth/auth.md` (identity API). In-scope endpoints are
> marked there; logout, MFA setup (enable/confirm/disable/recovery codes), and
> session management (list/revoke) are **out of scope** for this branch.

## Purpose

Build the authentication frontend in `apps/auth` (Next.js 16 App Router, React 19)
that consumes the backend identity API via a **full route-handler proxy**. The app
owns login, registration, OTP verification, password reset, MFA challenge, and
OAuth redirect/callback. Tokens live in httpOnly cookies; a shared-domain cookie
lets sibling dashboard apps read the session server-side.

## 1. Base URL & URL utility (single source of truth)

- **Env var:** `IDENTITY_API_URL`, default `https://<your-api-host>/api/v1`.
  Repointing the entire site to a different backend = changing one value.
- `lib/config/env.ts` — reads and exports `IDENTITY_API_URL`.
- `lib/api/url.ts` — `identityUrl(path: string): string` returns
  `${IDENTITY_API_URL}${path}`. No other code hardcodes a base URL or a path.

## 2. Route-handler proxy (only way the app talks to the backend)

All identity traffic goes through route handlers under `app/api/auth/...`:

| Handler | Backend target | Method |
| --- | --- | --- |
| `/api/auth/login` | `/identity/login` | POST |
| `/api/auth/register` | `/identity/register` | POST |
| `/api/auth/otp-verify` | `/identity/otp/verify` | POST |
| `/api/auth/otp-resend` | `/identity/otp/resend` | POST |
| `/api/auth/forgot-password` | `/identity/forgot-password` | POST |
| `/api/auth/reset-password` | `/identity/reset-password` | POST |
| `/api/auth/mfa-challenge` | `/identity/mfa/challenge` | POST |
| `/api/auth/oauth-redirect` | `/identity/oauth/{provider}/redirect` | GET |
| `/api/auth/oauth-callback` | `/identity/oauth/{provider}/callback` | GET |
| `/api/auth/refresh` | `/identity/refresh` | POST |
| `/api/auth/session` | — (reads cookies) | GET |

- Shared server helper `lib/api/identity.ts` wraps `fetch` against the backend,
  attaches the access token from cookies, and returns `{ status, body }` so
  handlers translate errors uniformly.
- **Silent refresh:** on a `401` from the backend, the handler reads the refresh
  cookie, calls `/identity/refresh`, stores the rotated pair (the backend rotates
  refresh tokens — always store the new one), and retries the original request
  once.
- Client components never call the backend directly and never see tokens.

## 3. Cookies

- `access_token` — httpOnly, `Secure`, `SameSite=Lax`, 15-min lifetime.
- `refresh_token` — httpOnly, `Secure`, `SameSite=Lax`, 30-day lifetime.
- `session` marker — httpOnly cookie with `domain` set to the parent domain so
  `web-school` / `web-admin` can read it **server-side**. Token secrets stay
  scoped to the auth app; dashboard apps validate the shared session cookie
  themselves (out of scope here).
- Set on success of login, register→verify, mfa-challenge, and oauth-callback.
- Cleared on 401-refresh failure / session expiry.

## 4. Pages

| Route | Flow |
| --- | --- |
| `/login` | identifier (email or phone) + password. On `mfa_required` response redirect to `/mfa-challenge?mfa_token=...`. On `ACCOUNT_LOCKED` show retry countdown using `retry_after`. |
| `/register` | full_name, phone, email, password + confirmation, optional `primary_role` (default `parent`). Success → `/verify-otp?purpose=email_verification`. |
| `/verify-otp` | 6-digit code input, purpose from query (`email_verification`), resend action (backend rate-limits to 5/hr → surface 429). |
| `/forgot-password` | email → always-same success message (anti-enumeration). |
| `/reset-password` | email + OTP + new password + confirmation. |
| `/mfa-challenge` | `mfa_token` from query + TOTP or recovery code → on success redirect to post-auth destination. |
| `/oauth/[provider]` | resolves `tenant_id` (query → cookie → env), calls backend redirect, navigates the browser to the returned provider URL. |
| `/oauth/[provider]/callback` | forwards `code` + `state` to backend. Success → set cookies → redirect to post-auth destination. MFA-required response → forward to `/mfa-challenge`. |

**Post-auth redirect:** env-configurable `AUTH_SUCCESS_REDIRECT` (default `/`);
dashboards validate the shared session cookie.

## 5. Error handling

- `lib/api/errors.ts` maps backend shapes to typed client errors:
  - 422 validation: `{ message, errors: { field: string[] } }` → per-field errors.
  - Business errors: `{ error, message }` (e.g. `INVALID_CREDENTIALS`,
    `ACCOUNT_LOCKED` incl. `retry_after` / `locked_until`).
  - RFC 7807 problem+json: `{ type, title, error_code, context }`.
  - 401 → silent refresh then retry (see §2).
  - 429 → rate-limit message for OTP resend / challenge.
  - 403 → provider not enabled (OAuth).
- Client components receive normalized, field-keyed errors for form display.

## 6. Form validation (zod)

`lib/schemas/` — zod schemas mirror the exact API rules:

- `loginSchema` — identifier max 255, password min 8.
- `registerSchema` — full_name max 255; phone max 20; email valid + max 255;
  password min 8; confirmation matches; role optional.
- `otpSchema` — `\d{6}`.
- `forgotPasswordSchema` — valid email.
- `resetPasswordSchema` — email, `\d{6}` OTP, password min 8 + confirmation.
- `mfaChallengeSchema` — mfa_token, code (6-digit or recovery code).

## 7. Client session state

- `useAuth` (lightweight) calls `/api/auth/session` to learn whether a session
  exists and the user id; pages gate on it. Tokens never reach the browser.

## 8. UI

- react-hook-form + zod for state/validation.
- shadcn/ui primitives (Input, Label, Button, Card) styled with the existing
  tokens in `app/globals.css`. Visuals are intentionally provisional — user will
  restyle later, so no bespoke design work this branch.

## 9. Testing

- None this branch. Verification = `bun run lint` and `bun run build`
  (`check-types`) in `apps/auth`.

## Out of scope

- Logout (§4.4), MFA enable/confirm/disable/recovery codes (§4.10–4.14), session
  list/revoke (§4.17–4.18), anything from the dashboard.
