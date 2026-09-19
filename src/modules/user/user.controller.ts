import { Request, Response } from 'express'
import { getProfile, updateProfile } from './user.service'
import { updateProfileSchema } from './user.validation'

export async function getMe(req: Request, res: Response) {
  try {
    const userId = req.user!.userId
    const profile = await getProfile(userId)
    return res.status(200).json(profile)
  } catch (err: any) {
    if (err.message === 'USER_NOT_FOUND') return res.status(404).json({ error: 'user not found' })
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}

export async function updateMe(req: Request, res: Response) {
  try {
    const userId = req.user!.userId

    const parsed = updateProfileSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: parsed.error.issues.map(i => i.message),
      })
    }

    const profile = await updateProfile(userId, parsed.data)
    return res.status(200).json(profile)
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}