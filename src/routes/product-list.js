const config = require('../config')

module.exports = async (fastify, options) => {
  fastify.register(require('@fastify/jwt'), {
    secret: config.customerJwtSecret
  })

  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }

    if (!config.adminEmails.includes(request.user.email)) {
      reply.code(401).send()
    }
  })
}
