module.exports = async (fastify, opts) => {
  fastify.register(require('./customers'), {
    prefix: '/customers'
  })
  fastify.register(require('./product-list'), {
    prefix: '/product-list'
  })
}
