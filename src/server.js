const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')
const config = require('./config.js')

const app = express()

app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(cors())

app.use('/', require('./routes/index.js'))

const server = app.listen(config.port, config.host, () => {
  console.log(`Listening on ${config.host}:${config.port}`)
})

process.on('SIGTERM', () => {
  console.log('Closing server')
  server.close(() => {
    console.log('Server closed')
  })
})
