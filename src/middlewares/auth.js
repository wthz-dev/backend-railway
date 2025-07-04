import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'No token' })

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    // console.log('Authentication successful, user data:', req.user)
    next()
  } catch (error) {
    console.error('Token verification failed:', error.message)
    res.status(401).json({ error: 'Invalid token' })
  }
}
