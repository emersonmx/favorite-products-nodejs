const config = require('./config')

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('@fastify/cors'))
fastify.register(require('@fastify/swagger'), {
  swagger: {
    info: {
      title: 'Favorite Products',
      description: 'An API to favorite and unfavorite customer products.',
      version: config.version
    },
    host: config.baseUrl
  }
})
fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs',
})

fastify.register(require('./routes'))

fastify.listen({ host: config.host, port: config.port }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  } else {
    fastify.log.info(`Listening on ${address}`)
  }
})
