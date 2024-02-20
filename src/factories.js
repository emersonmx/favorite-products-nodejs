const fp = require('fastify-plugin')
const { MemoryCustomersData } = require('./adapters/data')

module.exports = fp(async function(fastify, opts) {
  fastify.decorate('customersData', new MemoryCustomersData())
})
