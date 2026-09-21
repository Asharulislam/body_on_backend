import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../core/utils/jwt'

// extend Express's Request type so we can attach the user
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: string }
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'no token provided' })
  }

  const token = header.split(' ')[1]

  try {
    const payload = verifyToken(token)
    req.user = payload      // attach user info to the request
    next()                  // let the request continue
  } catch (err) {
    return res.status(401).json({ error: 'invalid or expired token' })
  }
}

export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'not authenticated' })
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'forbidden: insufficient permissions' })
    }
    next()
  }
}