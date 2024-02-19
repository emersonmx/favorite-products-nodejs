module.exports = async (fastify, opts) => {
  fastify.register(require('./customers'), {
    prefix: '/customers'
  })
}
