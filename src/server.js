const fs = require('node:fs');
const config = require('./config')

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('@fastify/cors'))
fastify.register(require('@fastify/helmet'))
fastify.register(require('@fastify/compress'))
fastify.register(require('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'Favorite Products',
      description: 'Uma API dos produtos favoritos do cliente.',
      version: config.version
    },
    components: {
      securitySchemes: {
        adminAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        customerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }
})
fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs',
})

fastify.register(require('./factories'))
fastify.register(require('./routes'))

fastify.listen({ host: config.host, port: config.port }, (err, _) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
