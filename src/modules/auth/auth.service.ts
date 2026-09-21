import bcrypt from "bcrypt";
import prisma from "../../core/config/prisma";
import { Role } from "../../generated/prisma/enums.js";
import { signToken } from "../../core/utils/jwt";
import { ResetPasswordInput, SigninInput } from "./auth.validation.js";
import { sendPasswordResetOtp } from "../../core/services/email.service";
import { generateOtp, hashOtp } from "../../core/utils/otp";

export async function signupUser(input: {
  fullName: string;
  email: string;
  password: string;
  role?: Role;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) throw new Error("EMAIL_IN_USE");

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      role: input.role ?? Role.customer,
    },
  });


  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
}

export async function signinUser(input: SigninInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
}


export async function forgotPasswordUser(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      message: "No email exist.",
    };
  }

  const otp = generateOtp();
  const otpHash = hashOtp(otp);

  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.passwordReset.upsert({
    where: {
      userId: user.id,
    },
    update: {
      otpHash,
      otpExpiresAt,
      otpAttempts: 0,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
    },
    create: {
      userId: user.id,
      otpHash,
      otpExpiresAt,
      otpAttempts: 0,
    },
  });

  await sendPasswordResetOtp(user.email, otp);

  return {
    message: "A password reset OTP has been sent.",
  };
}

export async function resetPasswordUser(
  input: ResetPasswordInput
) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error("INVALID_RESET_REQUEST");
  }

  const passwordReset = await prisma.passwordReset.findUnique({
    where: { userId: user.id },
  });

  if (!passwordReset) {
    throw new Error("INVALID_RESET_REQUEST");
  }

  if (passwordReset.otpExpiresAt < new Date()) {
    throw new Error("OTP_EXPIRED");
  }

  const otpHash = hashOtp(input.code);

  if (otpHash !== passwordReset.otpHash) {
    throw new Error("INVALID_OTP");
  }

  const passwordHash = await bcrypt.hash(input.newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),

    prisma.passwordReset.delete({
      where: { userId: user.id },
    }),
  ]);

  return {
    message: "Password reset successfully",
  };
}