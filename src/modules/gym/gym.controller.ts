import { Request, Response } from 'express'
import { createGym } from './gym.service'
import { createGymSchema } from './gym.validation'

export async function create(req: Request, res: Response) {
  try {
    const ownerId = req.user!.userId

    const parsed = createGymSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: parsed.error.issues.map(i => i.message),
      })
    }

    const gym = await createGym(ownerId, parsed.data)
    return res.status(201).json(gym)
  } catch (err: any) {
    if (err.message === 'GYM_ALREADY_EXISTS') {
      return res.status(409).json({ error: 'you already have a gym'})
    }
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}