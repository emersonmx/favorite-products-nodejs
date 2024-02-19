async function routes(fastify, options) {
  fastify.register(require('./customers'), {
    prefix: '/customers'
  })
}

module.exports = routes
