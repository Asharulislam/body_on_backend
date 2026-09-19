import prisma from '../../core/config/prisma'
import { getViewUrl } from '../upload/upload.service'
import { UpdateProfileInput } from './user.validation'

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('USER_NOT_FOUND')

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageKey ? await getViewUrl(user.profileImageKey) : null,
  }
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: input,
  })

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageKey ? await getViewUrl(user.profileImageKey) : null,
  }
}