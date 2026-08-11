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
  email: z.string().email().max(255),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().email().max(255),
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
