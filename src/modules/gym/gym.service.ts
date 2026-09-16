import prisma from "../../core/config/prisma";
import { CreateGymInput } from "./gym.validation";

export async function createGym(ownerId: string, input: CreateGymInput) {
  const existing = await prisma.gym.findUnique({ where: { ownerId } });
  if (existing) throw new Error("GYM_ALREADY_EXISTS");

  const gym = await prisma.gym.create({
    data: { ...input, ownerId },
  });

  return gym;
}
