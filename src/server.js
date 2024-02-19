const fastify = require('fastify')({
  logger: true
})
const config = require('./config')

fastify.register(require('./routes'))

fastify.listen({ host: config.host, port: config.port }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  } else {
    fastify.log.info(`Listening on ${address}`)
  }
})
