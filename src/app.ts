import express from 'express'
import swaggerUi from 'swagger-ui-express'
import openapiSpec from './core/docs/openapi'
import authRoutes from './modules/auth/auth.routes'
import gymRoutes from './modules/gym/gym.routes'
import uploadRoutes from './modules/upload/upload.routes'
import machinesRoutes from './modules/machines/machines.routes'


const app = express()
app.use(express.json())


app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() })
})

// raw spec, for client generators and other tooling
app.get('/docs.json', (_req, res) => {
    res.json(openapiSpec)
})

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, {
        customSiteTitle: 'Bodyon API docs',
        swaggerOptions: { persistAuthorization: true },
    })
)

app.use('/auth', authRoutes)

app.use('/gym', gymRoutes)

app.use('/upload', uploadRoutes)

app.use('/machines', machinesRoutes)
export default app