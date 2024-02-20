const fp = require('fastify-plugin')
const { MemoryCustomersData } = require('./adapters/data')

module.exports = fp(async function(fastify, opts) {
  const factories = {
    customersData: new MemoryCustomersData()
  }
  fastify.decorate('factories', factories)
})
