import bcrypt from "bcrypt";
import prisma from "../../core/config/prisma";
import { Role } from "../../generated/prisma/enums.js";
import { signToken } from "../../utils/jwt";
import { SigninInput } from "./auth.validation.js";
import { getViewUrl } from "../upload/upload.service.js";

export async function signupUser(input: {
  fullName: string;
  email: string;
  password: string;
  role?: Role;
  profileImage?: string;
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
      profileImage: input.profileImage,
    },
  });

  const profileImageUrl = user.profileImage
    ? await getViewUrl(user.profileImage)
    : null;

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileImageUrl,
  };
}

export async function signinUser(input: SigninInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  const token = signToken({ userId: user.id, role: user.role });

  const profileImageUrl = user.profileImage
    ? await getViewUrl(user.profileImage)
    : null;

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileImageUrl,
    },
  };
}
