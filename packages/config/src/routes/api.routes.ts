export const API_ROUTES = {
  base: "/api/v1",
  login: "/identity/login",
  logout: "/identity/logout",
  register: "/identity/register",
  me: "/identity/me",
  refresh: "/identity/refresh",
  forgotPassword: "/identity/forgot-password",
  otpVerify: "/identity/otp/verify",
  user: (userId: string) => `/identity/users/${userId}`,
  userProfile: (userId: string) => `/identity/users/${userId}/profile`,
  context: "/api/v1/context",
} as const;
