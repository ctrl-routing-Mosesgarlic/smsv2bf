export const IDENTITY_API_URL =
  process.env.IDENTITY_API_URL ?? "http://localhost:8000/api/v1";

export const AUTH_SUCCESS_REDIRECT =
  process.env.AUTH_SUCCESS_REDIRECT ?? process.env.NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT ?? "/";

export const NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT =
  process.env.NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT ?? "/";

export const SESSION_COOKIE_DOMAIN = process.env.SESSION_COOKIE_DOMAIN;

export const NEXT_PUBLIC_DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID;
