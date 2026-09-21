import { z } from "zod";

import { Role } from "../../generated/prisma/enums.js";

export const signupSchema = z.object({
  fullName: z.string().min(2, "fullName must be at least 2 characters"),
  email: z.email("invalid email address"),
  password: z.string().min(6, "password must be at least 6 characters"),
  role: z.enum([Role.customer, Role.gym_owner]).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export const signinSchema = z.object({
  email: z.email("invalid email address"),
  password: z.string().min(1, "password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.email("Invalid email address"),
  code: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
