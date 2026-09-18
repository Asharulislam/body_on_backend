import { Router } from 'express'
import { createUploadUrl, createViewUrl } from './upload.controller'
import { authenticate } from '../../middlewares/auth.middleware'

const router = Router()
router.post('/url', authenticate, createUploadUrl)
router.get('/view-url', authenticate , createViewUrl)

export default router