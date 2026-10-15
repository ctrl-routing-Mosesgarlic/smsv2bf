const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3004";

export const LINKS = {
  signUp: `${ADMIN_URL}/register`,
  signIn: `${ADMIN_URL}/login`,
  contact: "/contact",
  modules: "/modules",
  pricing: "/pricing",
} as const;
