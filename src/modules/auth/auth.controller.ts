import { Request, Response } from 'express'
import { signupUser } from './auth.service'
import { Role } from '../../generated/prisma/enums.js'

// super_admin is created manually, never through the API
const PUBLIC_SIGNUP_ROLES: Role[] = [Role.customer, Role.gym_owner]

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' })
    }
    if (role !== undefined && !PUBLIC_SIGNUP_ROLES.includes(role)) {
      return res.status(400).json({ error: 'invalid role' })
    }
    const user = await signupUser({ name, email, password, role })
    return res.status(201).json(user)
  } catch (err: any) {
    if (err.message === 'EMAIL_IN_USE') {
      return res.status(409).json({ error: 'email already in use' })
    }
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}