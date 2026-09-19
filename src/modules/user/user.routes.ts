import { Router } from 'express'
import { getMe, updateMe } from './user.controller'
import { authenticate } from '../../middlewares/auth.middleware'

const router = Router()
router.get('/me', authenticate, getMe)
router.patch('/me', authenticate, updateMe)

export default router