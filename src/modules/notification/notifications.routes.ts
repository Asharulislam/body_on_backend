import { Router } from 'express'
import { list, remove, saveToken } from './notification.controller'
import { authenticate } from '../../middlewares/auth.middleware'

const router = Router()

router.get('/', authenticate, list)
router.delete('/:id', authenticate, remove)
router.post('/device-token', authenticate, saveToken)

export default router