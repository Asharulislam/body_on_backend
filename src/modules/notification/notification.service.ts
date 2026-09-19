import prisma from "../../core/config/prisma";
import { NotificationType } from "../../generated/prisma/enums";

// internal creator — other modules call this when events happen
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
) {
  return prisma.notification.create({
    data: { userId, type, title, body },
  });
}

// list the user's notifications
export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// delete one notification (must belong to the user)
export async function deleteNotification(
  userId: string,
  notificationId: string,
) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });
  if (!notification || notification.userId !== userId)
    throw new Error("NOTIFICATION_NOT_FOUND");

  await prisma.notification.delete({ where: { id: notificationId } });
  return { success: true };
}

// save (or update) a device token
export async function saveDeviceToken(userId: string, token: string) {
  // upsert: if this token already exists, update its owner; otherwise create it
  return prisma.deviceToken.upsert({
    where: { token },
    update: { userId },
    create: { userId, token },
  });
}
