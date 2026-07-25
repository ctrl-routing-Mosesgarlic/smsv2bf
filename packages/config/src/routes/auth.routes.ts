export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  otpVerification: "/otp-verification",
} as const;

export const AUTH_ROUTE_PATHS = Object.values(AUTH_ROUTES);
