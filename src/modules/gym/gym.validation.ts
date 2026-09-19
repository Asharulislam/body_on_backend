import z from "zod";

export const createGymSchema = z.object({
  gymName: z.string().min(2, 'gymName must be at least 2 characters'),
  address: z.string().min(1, 'address is required'),
  city: z.string().min(1, 'city is required'),
  description: z.string().optional(),
  phone: z.string().optional(),
})

export const updateGymSchema = z.object({
  gymName: z.string().min(2, 'gymName must be at least 2 characters').optional(),
  address: z.string().min(1, 'address is required').optional(),
  city: z.string().min(1, 'city is required').optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
})

export const addGymImageSchema = z.object({
  key: z.string().min(1, 'key is required'),
})


export type AddGymImageInput = z.infer<typeof addGymImageSchema>
export type UpdateGymInput = z.infer<typeof updateGymSchema>
export type CreateGymInput = z.infer<typeof createGymSchema>