# Authentication &amp; Identity API Reference

> For the frontend team. This document describes every authentication-related endpoint  
> exposed by the backend, with exact request payloads and response shapes.  
> You do **not** need to read any backend code to consume these APIs.
>
> For things like the base URL, have an environment variables that can be set and changed anytime to change for the entire site, and also have a function, an helper function, a utility function that generates the URL given the base URL and the path. So, changing the base URL for the actual backend server only needs to be one line change in a file that is already known at not digging through multiple files to make the single change
>
> Sure, you are working on an authentication feature branch

---

## 1. Base Information


| Item                    | Value                                                          |
| ----------------------- | -------------------------------------------------------------- |
| Base URL                | `https://<your-api-host>/api/v1`                               |
| Content-Type (request)  | `application/json`                                             |
| Content-Type (response) | `application/json` (errors may use `application/problem+json`) |
| Auth scheme             | `Bearer` token in the `Authorization` header                   |


All paths below are relative to the base URL. For example:

```
POST https://<your-api-host>/api/v1/identity/login

```

### Tenant header

The API is **multi-tenant**. Most authenticated requests are scoped to the tenant of  
the logged-in user, so you usually do not need to send anything extra. Public  
endpoints that must know the tenant accept it explicitly (e.g. `tenant_id` on  
registration — see below).

---

## 2. Authentication / Token Lifecycle


| Token           | Purpose                                                      | Lifetime   |
| --------------- | ------------------------------------------------------------ | ---------- |
| `access_token`  | Authorize API calls (`Authorization: Bearer <access_token>`) | 15 minutes |
| `refresh_token` | Obtain new tokens without re-login                           | 30 days    |


Flow:

1. `POST /identity/login` (or OAuth / MFA challenge) returns an access token + refresh token.
2. Send the access token on every authenticated request: 
  ```
  Authorization: Bearer <access_token>
  
  ```
3. When the access token expires (HTTP `401`), call `POST /identity/refresh` with the  
refresh token to get a fresh pair. The old refresh token is **rotated** — the new  
response contains a new refresh token you must store.
4. Logging out (`POST /identity/logout`) revokes the current session/tokens.

### Standard success token payload

The following shape is returned by `login`, `refresh`, and the MFA challenge:

```jsonc
{
  "data": {
    "access_token":  "string",                 // JWT-like access token (opaque string)
    "expires_in":    900,                      // integer, seconds until expiry
    "token_type":    "Bearer",                 // always "Bearer"
    "refresh_token": "string",                 // opaque string, 30-day lifetime
    "user_id":       "string"                  // UUID (v7) of the authenticated user
  }
}

```

---

## 3. Error Response Conventions

Two shapes are used:

### 3.1 Validation errors — HTTP `422`

Thrown automatically when the request body fails validation (wrong types, missing  
required fields, wrong lengths, etc.):

```jsonc
{
  "message": "The given data was invalid.",
  "errors": {
    "email":    ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}

```

### 3.2 Business errors — controller-shaped

Thrown intentionally by the auth flow. The keys vary per endpoint (documented below).  
Common ones:

```jsonc
{
  "error":  "INVALID_CREDENTIALS",            // machine-readable code
  "message": "Invalid credentials."            // human-readable message
}

```

Special cases you must handle:


| HTTP status | `error` code          | When                                                                   |
| ----------- | --------------------- | ---------------------------------------------------------------------- |
| `401`       | `INVALID_CREDENTIALS` | Wrong email/phone + password                                           |
| `401`       | `INVALID_TOKEN`       | Refresh token missing/invalid/expired                                  |
| `401`       | —                     | Access token expired or invalid                                        |
| `423`       | `ACCOUNT_LOCKED`      | Too many failed login attempts (returns `retry_after`, `locked_until`) |
| `422`       | various               | Validation or domain errors                                            |
| `403`       | —                     | OAuth provider not enabled                                             |
| `429`       | —                     | Rate limited (too many OTP attempts/resends)                           |


### 3.3 RFC 7807 problem+json

Some domain exceptions are rendered as `application/problem+json`:

```jsonc
{
  "type":       "https://school-platform.example/errors/<error_code>",
  "title":      "human-readable error",
  "error_code": "MACHINE_READABLE_CODE",
  "context":    { }                            // optional extra fields
}

```

---

## 4. Endpoints

### 4.1 Register a new account

`POST /identity/register` — *public, no auth*

Request body:


| Field                   | Type   | Required | Rules                                          |
| ----------------------- | ------ | -------- | ---------------------------------------------- |
| `full_name`             | string | ✅        | max 255                                        |
| `phone`                 | string | ✅        | max 20 (Kenyan phone format expected)          |
| `email`                 | string | ✅        | valid email, max 255                           |
| `password`              | string | ✅        | min 8                                          |
| `password_confirmation` | string | ✅        | must equal `password`                          |
| `primary_role`          | string | ❌        | must be a valid role key; defaults to `parent` |


```jsonc
{
  "full_name":             "Jane Doe",
  "phone":                 "+254712345678",
  "email":                 "jane@example.com",
  "password":              "secretpass123",
  "password_confirmation": "secretpass123",
  "primary_role":          "parent"            // optional
}

```

Response `201 Created`:

```jsonc
{
  "data": {
    "user_id":      "0190f...uuid...",
    "verification": "otp_sent"                 // always "otp_sent"
  }
}

```

> After registering, an OTP is sent to the user (email/SMS). The account is not  
> fully active until the email OTP is verified via `POST /identity/otp/verify`.

---

### 4.2 Login

`POST /identity/login` — *public, no auth*

`identifier` accepts **either** an email or a phone number.


| Field          | Type   | Required | Rules                                         |
| -------------- | ------ | -------- | --------------------------------------------- |
| `identifier`   | string | ✅        | email OR phone, max 255                       |
| `password`     | string | ✅        | min 8                                         |
| `device_label` | string | ❌        | max 255 — free text naming the device/browser |


```jsonc
{
  "identifier":   "jane@example.com",          // or "+254712345678"
  "password":     "secretpass123",
  "device_label": "Chrome on Windows"
}

```

Response `200 OK` — success (token payload, see §2):

```jsonc
{
  "data": {
    "access_token":  "eyJ...",
    "expires_in":    900,
    "token_type":    "Bearer",
    "refresh_token": "5f3d...",
    "user_id":       "0190f...uuid..."
  }
}

```

Response `200 OK` — **MFA required** (user has 2FA enabled):

```jsonc
{
  "mfa_required": true,
  "mfa_token":    "3f0a...random-string...",   // must be sent to /identity/mfa/challenge
  "message":      "MFA code required. Submit the mfa_token with a TOTP or recovery code to /mfa/challenge."
}

```

Response `423 Locked` — account locked:

```jsonc
{
  "error":       "ACCOUNT_LOCKED",
  "message":     "Your account is temporarily locked.",
  "retry_after": 900,                          // integer seconds
  "locked_until": "2026-08-09T10:15:00+00:00"  // ISO-8601 timestamp
}

```

> Also returns an HTTP `Retry-After` header.

Response `401 Unauthorized` — bad credentials:

```jsonc
{
  "error":   "INVALID_CREDENTIALS",
  "message": "Invalid credentials."
}

```

---

### 4.3 Refresh tokens

`POST /identity/refresh` — *public, no auth* (uses the refresh token, not the access token)

Provide the refresh token **either** as a Bearer header **or** in the body:

```
Authorization: Bearer <refresh_token>

```

or

```jsonc
{
  "refresh_token": "5f3d..."
}

```

Response `200 OK` — fresh token pair (old refresh token is rotated):

```jsonc
{
  "data": {
    "access_token":  "eyJ...",
    "expires_in":    900,
    "token_type":    "Bearer",
    "refresh_token": "new-refresh-token...",   // STORE THIS — the old one is invalid
    "user_id":       "0190f...uuid..."
  }
}

```

Response `400 Bad Request` — token missing:

```jsonc
{
  "error":   "MISSING_TOKEN",
  "message": "Refresh token is required."
}

```

Response `401 Unauthorized` — invalid/expired:

```jsonc
{
  "error":   "INVALID_TOKEN",
  "message": "Refresh token is invalid or expired."
}

```

---

ignore 4.4, it is part of the dashboard and just an api call, not in our scope

### 4.4 Logout

`POST /identity/logout` — *authenticated* (`Authorization: Bearer <access_token>`)

No request body.

Response `200 OK`:

```jsonc
{
  "data": {
    "logged_out": true
  }
}

```

---

### 4.5 Verify OTP

`POST /identity/otp/verify` — *public* (expects the caller to be in the OTP flow; requires authentication context / bearer token)

Verifies an OTP code for a given purpose. When `purpose` is `email_verification`,  
this also activates the user's account.


| Field     | Type   | Required | Rules                                                             |
| --------- | ------ | -------- | ----------------------------------------------------------------- |
| `code`    | string | ✅        | exactly 6 digits (`\d{6}`)                                        |
| `purpose` | string | ✅        | one of: `email_verification`, `password_reset`, `two_factor_auth` |


```jsonc
{
  "code":    "483920",
  "purpose": "email_verification"
}

```

Response `200 OK`:

```jsonc
{
  "message": "OTP verified successfully."
}

```

Response `422 Unprocessable Entity`:

```jsonc
{
  "error": "The provided OTP is invalid or expired."
}

```

---

### 4.6 Resend OTP

`POST /identity/otp/resend` — *public*

Sends a new email-verification OTP. No request body.

Response `200 OK`:

```jsonc
{
  "message": "A new verification code has been sent."
}

```

> Subject to rate limiting (max 5 resends/hour per user, HTTP `429` when exceeded).

---

### 4.7 Request password reset

`POST /identity/forgot-password` — *public, no auth*


| Field   | Type   | Required | Rules       |
| ------- | ------ | -------- | ----------- |
| `email` | string | ✅        | valid email |


```jsonc
{
  "email": "jane@example.com"
}

```

Response `200 OK` — **always identical**, whether or not the email exists  
(prevents account enumeration):

```jsonc
{
  "message": "If the email exists, a reset code has been sent."
}

```

---

### 4.8 Reset password with OTP

`POST /identity/reset-password` — *public, no auth*


| Field                   | Type   | Required | Rules                 |
| ----------------------- | ------ | -------- | --------------------- |
| `email`                 | string | ✅        | valid email           |
| `otp`                   | string | ✅        | exactly 6 digits      |
| `password`              | string | ✅        | min 8                 |
| `password_confirmation` | string | ✅        | must equal `password` |


```jsonc
{
  "email":                 "jane@example.com",
  "otp":                   "482910",
  "password":              "newsecret123",
  "password_confirmation": "newsecret123"
}

```

Response `200 OK`:

```jsonc
{
  "message": "Password reset successfully."
}

```

Response `422 Unprocessable Entity` — account invalid/inactive or bad OTP:

```jsonc
{
  "error": "Invalid or inactive account."
}

```

or

```jsonc
{
  "error": "The provided OTP is invalid or expired."
}

```

---

### 4.9 MFA challenge (complete login after 2FA prompt)

`POST /identity/mfa/challenge` — *public, no auth*

Completes a login that was interrupted by the `mfa_required` response. Accepts a  
TOTP code **or** a recovery code.


| Field          | Type   | Required | Rules                                            |
| -------------- | ------ | -------- | ------------------------------------------------ |
| `mfa_token`    | string | ✅        | the token from the login `mfa_required` response |
| `code`         | string | ✅        | 6-digit TOTP **or** recovery code                |
| `device_label` | string | ❌        | max 255                                          |


```jsonc
{
  "mfa_token":    "3f0a...random-string...",
  "code":         "123456",
  "device_label": "Chrome on Windows"
}

```

Response `200 OK` — token payload (see §2):

```jsonc
{
  "data": {
    "access_token":  "eyJ...",
    "expires_in":    900,
    "token_type":    "Bearer",
    "refresh_token": "5f3d...",
    "user_id":       "0190f...uuid..."
  }
}

```

Response `422 Unprocessable Entity`:

```jsonc
{
  "error": "Invalid MFA code."
}

```

---

in dashboard, not in our scope (4.10 - 4.14)

### 4.10 Enable MFA

`POST /identity/mfa/enable` — *authenticated*

No request body. Starts 2FA setup for the current user.

Response `200 OK`:

```jsonc
{
  "data": {
    "qr_code": "otpauth-migration://offline?...",   // QR payload string (render as QR)
    "uri":     "otpauth://totp/App:jane@example.com?...",  // otpauth URI for authenticator apps
    "secret":  "JBSWY3DPEHPK3PXP"                   // base32 secret (never log it)
  }
}

```

> User must now scan the QR / enter the secret in an authenticator app, then  
> confirm with `POST /identity/mfa/confirm`.

---

### 4.11 Confirm MFA

`POST /identity/mfa/confirm` — *authenticated*


| Field  | Type   | Required | Rules                                           |
| ------ | ------ | -------- | ----------------------------------------------- |
| `code` | string | ✅        | current 6-digit TOTP from the authenticator app |


```jsonc
{
  "code": "482910"
}

```

Response `200 OK`:

```jsonc
{
  "message": "MFA enabled successfully."
}

```

Response `422 Unprocessable Entity` — wrong code:

```jsonc
{
  "error": "Invalid MFA code."
}

```

---

### 4.12 Disable MFA

`POST /identity/mfa/disable` — *authenticated*

No request body.

Response `200 OK`:

```jsonc
{
  "message": "MFA disabled successfully."
}

```

---

### 4.13 List recovery codes

`GET /identity/mfa/recovery-codes` — *authenticated*

No query parameters. Returns the user's saved recovery codes.

Response `200 OK`:

```jsonc
{
  "data": [
    "recovery-code-1",
    "recovery-code-2"
    // ... up to N one-time recovery codes
  ]
}

```

---

### 4.14 Regenerate recovery codes

`POST /identity/mfa/recovery-codes/regenerate` — *authenticated*

No request body. Invalidates old recovery codes and generates new ones.

Response `200 OK`:

```jsonc
{
  "data": [
    "new-recovery-code-1",
    "new-recovery-code-2"
    // ... new set of one-time recovery codes
  ]
}

```

---

### 4.15 OAuth / SSO — start redirect

`GET /identity/oauth/{provider}/redirect` — *public, no auth*


| Path param | Type   | Values                 |
| ---------- | ------ | ---------------------- |
| `provider` | string | `google` | `microsoft` |


Query parameter:


| Param       | Type          | Required |
| ----------- | ------------- | -------- |
| `tenant_id` | string (UUID) | ✅        |


Example:

```
GET /api/v1/identity/oauth/google/redirect?tenant_id=0190f...uuid...

```

Response `200 OK` — the URL the frontend should navigate the browser to:

```jsonc
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&state=..."
}

```

Response `403 Forbidden` — provider not enabled:

```jsonc
{
  "error": "OAuth provider 'google' is not enabled."
}

```

> The `state` parameter is embedded by the backend and carries the `tenant_id`.  
> The provider callback will send it back and the frontend forwards it as-is.

---

### 4.16 OAuth / SSO — callback

`GET /identity/oauth/{provider}/callback` — *public, no auth*

This is the URL the OAuth provider redirects the browser back to. The frontend  
**must forward** the provider's query parameters to the API:


| Query param | Type                 | Required                            |
| ----------- | -------------------- | ----------------------------------- |
| `code`      | string (UUID)        | ✅                                   |
| `state`     | string (JSON string) | ✅ — contains `{"tenant_id": "..."}` |


Example:

```
GET /api/v1/identity/oauth/google/callback?code=...&state=%7B%22tenant_id%22%3A%22...%22%7D

```

Response `200 OK` — token payload (see §2):

```jsonc
{
  "data": {
    "access_token":  "eyJ...",
    "expires_in":    900,
    "token_type":    "Bearer",
    "refresh_token": "5f3d...",
    "user_id":       "0190f...uuid..."
  }
}

```

Error responses:


| Status | Body                                            | Meaning                                                |
| ------ | ----------------------------------------------- | ------------------------------------------------------ |
| `400`  | `{ "error": "Invalid OAuth state parameter." }` | Bad/malformed state                                    |
| `401`  | `{ "error": "..." }`                            | OAuth authentication failed                            |
| `401`  | `{ "error": "...", "mfa_token": "..." }`        | MFA required — continue with `/identity/mfa/challenge` |
| `403`  | `{ "error": "..." }`                            | Provider not enabled                                   |
| `422`  | `{ "error": "..." }`                            | Other domain error                                     |


> First-time social logins auto-provision a user account (active + email verified).

---

not in scope, skip and dont pay atention to 4.17 - 4.18)

### 4.17 List sessions

`GET /identity/sessions` — *authenticated*

No query parameters. Returns all active sessions for the current user.

Response `200 OK`:

```jsonc
[
  {
    "id":           "0190f...session-uuid...",
    "device_label": "Chrome on Windows",
    "ip":           "192.168.1.10",
    "issued_at":    "2026-08-09T08:00:00+00:00",  // ISO-8601
    "expires_at":   "2026-09-08T08:00:00+00:00"   // ISO-8601
  }
]

```

---

### 4.18 Revoke a session

`DELETE /identity/sessions/{session}` — *authenticated*


| Path param | Type          | Required                  |
| ---------- | ------------- | ------------------------- |
| `session`  | string (UUID) | ✅ — session id from §4.17 |


Response `200 OK`:

```jsonc
{
  "message": "Session revoked successfully."
}

```

Response `422 Unprocessable Entity`:

```jsonc
{
  "error": "Session not found."
}

```

---

## 5. Quick Reference Table


| Method | Path                                      | Auth          | Purpose                          |
| ------ | ----------------------------------------- | ------------- | -------------------------------- |
| POST   | `/identity/register`                      | —             | Create account                   |
| POST   | `/identity/login`                         | —             | Sign in (email/phone + password) |
| POST   | `/identity/refresh`                       | refresh token | Rotate token pair                |
| POST   | `/identity/logout`                        | access token  | Revoke current session           |
| POST   | `/identity/otp/verify`                    | OTP flow      | Verify OTP code                  |
| POST   | `/identity/otp/resend`                    | OTP flow      | Resend email-verification OTP    |
| POST   | `/identity/forgot-password`               | —             | Request reset OTP                |
| POST   | `/identity/reset-password`                | —             | Reset password with OTP          |
| POST   | `/identity/mfa/challenge`                 | —             | Complete 2FA login               |
| POST   | `/identity/mfa/enable`                    | access token  | Start 2FA setup                  |
| POST   | `/identity/mfa/confirm`                   | access token  | Confirm 2FA setup                |
| POST   | `/identity/mfa/disable`                   | access token  | Disable 2FA                      |
| GET    | `/identity/mfa/recovery-codes`            | access token  | List recovery codes              |
| POST   | `/identity/mfa/recovery-codes/regenerate` | access token  | Regenerate recovery codes        |
| GET    | `/identity/oauth/{provider}/redirect`     | —             | Start OAuth flow                 |
| GET    | `/identity/oauth/{provider}/callback`     | —             | OAuth provider callback          |
| GET    | `/identity/sessions`                      | access token  | List active sessions             |
| DELETE | `/identity/sessions/{session}`            | access token  | Revoke a session                 |
|        |                                           |               |                                  |


