import prisma from "../../core/config/prisma";
import { getViewUrl } from "../upload/upload.service";
import { CreateGymInput, UpdateGymInput } from "./gym.validation";

const MAX_IMAGES = 10;
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

//gym images
export async function addGymImage(ownerId: string, imageKey: string) {
  const gym = await prisma.gym.findUnique({ where: { ownerId } });
  if (!gym) throw new Error("GYM_NOT_FOUND");

  const count = await prisma.gymImage.count({ where: { gymId: gym.id } });
  if (count >= MAX_IMAGES) throw new Error("IMAGE_LIMIT_REACHED");

  return prisma.gymImage.create({
    data: { imageKey, gymId: gym.id },
  });
}

export async function deleteGymImage(ownerId: string, imageId: string) {
  const gym = await prisma.gym.findUnique({ where: { ownerId } });
  if (!gym) throw new Error("GYM_NOT_FOUND");

  const image = await prisma.gymImage.findUnique({ where: { id: imageId } });
  if (!image || image.gymId !== gym.id) throw new Error("IMAGE_NOT_FOUND");

  await prisma.gymImage.delete({ where: { id: imageId } });
  return { success: true };
}

export async function getGymImages(ownerId: string) {
  const gym = await prisma.gym.findUnique({ where: { ownerId } })
  if (!gym) throw new Error('GYM_NOT_FOUND')

  const images = await prisma.gymImage.findMany({
    where: { gymId: gym.id },
    orderBy: { createdAt: 'desc' },
  })

  return Promise.all(
    images.map(async (img) => ({
      id: img.id,
      url: await getViewUrl(img.imageKey),   // key → temporary url
    }))
  )
}