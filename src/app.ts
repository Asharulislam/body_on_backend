import express from 'express'
import authRoutes from './modules/auth/auth.routes'
import gymRoutes from './modules/gym/gym.routes'
import uploadRoutes from './modules/upload/upload.routes'


const app = express()
app.use(express.json())


app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() })
})

app.use('/auth', authRoutes)

app.use('/gym', gymRoutes)

app.use('/upload', uploadRoutes)
export default app