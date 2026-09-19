import { z } from 'zod'

export const saveTokenSchema = z.object({
  token: z.string().min(1, 'token is required'),
})