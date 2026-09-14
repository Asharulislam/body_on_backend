import bcrypt from 'bcrypt'
import prisma from '../../core/config/prisma'
import { Role } from '../../generated/prisma/enums.js'
import { signToken } from '../../utils/jwt'

export async function signupUser(input: {
  name: string
  email: string
  password: string
  role?: Role
}) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw new Error('EMAIL_IN_USE')

  const passwordHash = await bcrypt.hash(input.password, 10)

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role ?? Role.customer,
    },
  })

  return { id: user.id, name: user.name, email: user.email, role: user.role }
}


export async function signinUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) throw new Error('INVALID_CREDENTIALS')

  const valid = await bcrypt.compare(input.password, user.passwordHash)
  if (!valid) throw new Error('INVALID_CREDENTIALS')

  const token = signToken({ userId: user.id, role: user.role })

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  }
}