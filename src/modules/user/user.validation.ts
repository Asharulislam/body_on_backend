import { z } from 'zod'

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'fullName must be at least 2 characters').optional(),
  profileImage: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>