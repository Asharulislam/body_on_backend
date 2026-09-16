import express from 'express'
import authRoutes from './modules/auth/auth.routes'
import gymRoutes from './modules/gym/gym.routes'

const app = express()
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/auth', authRoutes)

app.use('/gym', gymRoutes)

export default app