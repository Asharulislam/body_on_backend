import { Request, Response } from 'express'
import { getNotifications, deleteNotification, saveDeviceToken } from '../notification/notification.service'
import { saveTokenSchema } from './notification.validation'

export async function list(req: Request, res: Response) {
  try {
    const userId = req.user!.userId
    const notifications = await getNotifications(userId)
    return res.status(200).json(notifications)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const userId = req.user!.userId
    const notificationId = String(req.params.id)
    const result = await deleteNotification(userId, notificationId)
    return res.status(200).json(result)
  } catch (err: any) {
    if (err.message === 'NOTIFICATION_NOT_FOUND') {
      return res.status(404).json({ error: 'notification not found' })
    }
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}

export async function saveToken(req: Request, res: Response) {
  try {
    const userId = req.user!.userId

    const parsed = saveTokenSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: parsed.error.issues.map(i => i.message),
      })
    }

    await saveDeviceToken(userId, parsed.data.token)
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}