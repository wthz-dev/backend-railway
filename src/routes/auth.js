import express from 'express'
import { login, register, refresh, me } from '../controllers/authController.js'
import { authenticate } from '../middlewares/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/refresh', refresh)
router.get('/me', authenticate, me)

export default router
