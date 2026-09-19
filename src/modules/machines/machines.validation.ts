import { z } from 'zod'

export const createMachineSchema = z.object({
  machineName: z.string().min(2, 'machineName must be at least 2 characters'),
  description: z.string().min(1, 'description is required'),
  imageKey: z.string().min(1, 'imageKey is required'),
})

export const updateMachineSchema = z.object({
  machineName: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  imageKey: z.string().min(1).optional(),
})

export type UpdateMachineInput = z.infer<typeof updateMachineSchema>
export type CreateMachineInput = z.infer<typeof createMachineSchema>