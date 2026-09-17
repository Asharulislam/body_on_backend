import z from "zod";

export const uploadSchema = z.object({
  folder: z.enum(['gyms', 'machines', 'profiles']),
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
})