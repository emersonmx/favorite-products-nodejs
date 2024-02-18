const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')
const config = require('./config')
const factories = require('./factories')

const logger = factories.makeLogger()
const app = express()

app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(cors())

app.use('/', require('./routes'))

const server = app.listen(config.port, config.host, () => {
  logger.info(`Listening on ${config.host}:${config.port}`)
})

process.on('SIGTERM', () => {
  logger.info('Closing server')
  server.close(() => {
    logger.info('Server closed')
  })
})
