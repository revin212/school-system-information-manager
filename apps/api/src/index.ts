import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { env } from './env'
import { auth } from './auth/auth'
import { errorHandler } from './middlewares/errorHandler'
import { healthRouter } from './routes/health'
import { subjectsRouter } from './routes/subjects'
import { authRouter } from './routes/auth'
import { masterRouter } from './routes/master'
import { sdmRouter } from './routes/sdm'
import { akademikRouter } from './routes/akademik'
import { keuanganRouter } from './routes/keuangan'
import { sekolahRouter } from './routes/sekolah'
import { reportsRouter } from './routes/reports'

const app = express()

app.set('trust proxy', 1)

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
)

// Only apply JSON parsing to our own REST endpoints.
// Better Auth mounts its own handler under `/api/auth/*` and should not be affected.
app.use(['/api/v1', '/api/auth/login', '/api/auth/logout'], express.json())

app.use(healthRouter)
app.use(authRouter)
app.use(subjectsRouter)
app.use(masterRouter)
app.use(sdmRouter)
app.use(akademikRouter)
app.use(keuanganRouter)
app.use(sekolahRouter)
app.use(reportsRouter)

// Better Auth catch-all (must be after our custom /api/auth/* routes).
app.all('/api/auth/{*any}', toNodeHandler(auth))

app.use(errorHandler)

app.listen(env.API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${env.API_PORT}`)
})

