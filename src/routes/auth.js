import express from 'express'
import { login, register, refresh } from '../controllers/authController.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/refresh', refresh) // 👈 ใหม่

export default router
