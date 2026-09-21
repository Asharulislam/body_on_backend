import jwt from 'jsonwebtoken'

function requireSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set in .env')
  return secret
}

const JWT_SECRET: string = requireSecret()

export function signToken(payload: { userId: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as unknown as { userId: string; role: string }
}