import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { router } from './routes/index.js'

const host = '127.0.0.1'
const port = 3000

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cors())

app.use('/', router)

const server = app.listen(port, host, () => {
  console.log(`Listening on ${host}:${port}`)
})

process.on('SIGTERM', () => {
  console.log('Closing server')
  server.close(() => {
    console.log('Server closed')
  })
})
