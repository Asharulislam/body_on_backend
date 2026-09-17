import { z } from 'zod'

import { Role } from '../../generated/prisma/enums.js'

export const signupSchema = z.object({
  fullName: z.string().min(2, 'fullName must be at least 2 characters'),
  email: z.email('invalid email address'),
  password: z.string().min(6, 'password must be at least 6 characters'),
  role: z.enum([Role.customer, Role.gym_owner]).optional(),
  profileImage: z.url('profileImage must be a valid URL').optional(),
})


export const signinSchema = z.object({
  email: z.email('invalid email address'),
  password: z.string().min(1, 'password is required'),
})

export type SignupInput = z.infer<typeof signupSchema>
export type SigninInput = z.infer<typeof signinSchema>