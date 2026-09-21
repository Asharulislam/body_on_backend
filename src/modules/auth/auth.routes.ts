import { Router } from 'express'
import {forgotPassword, resetPassword, signin, signup } from './auth.controller'


const router = Router()
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/forgotpassword', forgotPassword)
router.post('/forgotpassword', resetPassword)


export default router