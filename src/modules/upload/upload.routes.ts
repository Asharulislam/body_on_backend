import { Router } from 'express'
import { createUploadUrl } from './upload.controller'
import { authenticate } from '../../middlewares/auth.middleware'

const router = Router()
router.post('/url', authenticate, createUploadUrl)

export default router