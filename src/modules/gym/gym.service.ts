import prisma from "../../core/config/prisma";
import { CreateGymInput, UpdateGymInput } from "./gym.validation";

export async function createGym(ownerId: string, input: CreateGymInput) {
  const existing = await prisma.gym.findUnique({ where: { ownerId } });
  if (existing) throw new Error("GYM_ALREADY_EXISTS");

  const gym = await prisma.gym.create({
    data: { ...input, ownerId },
  });

  return gym;
}


export async function getMyGym(ownerId: string) {
  const gym = await prisma.gym.findUnique({ where: { ownerId } });
  if (!gym) throw new Error("GYM_NOT_FOUND");
  return gym;
}

export async function updateGym(ownerId: string, input: UpdateGymInput) {
  const gym = await prisma.gym.findUnique({ where: { ownerId } });
  if (!gym) throw new Error("GYM_NOT_FOUND");

  return prisma.gym.update({
    where: { ownerId },
    data: input,
  });
}