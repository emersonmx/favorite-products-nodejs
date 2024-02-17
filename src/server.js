import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { router } from './routes/index.js'
import config from './config.js'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cors())

app.use('/', router)

const server = app.listen(config.port, config.host, () => {
  console.log(`Listening on ${config.host}:${config.port}`)
})

process.on('SIGTERM', () => {
  console.log('Closing server')
  server.close(() => {
    console.log('Server closed')
  })
})
