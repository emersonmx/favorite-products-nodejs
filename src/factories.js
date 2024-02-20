const fp = require('fastify-plugin')
const { MemoryCustomersData } = require('./adapters/data')
const { CreateCustomer, FindCustomerById, FindCustomerByEmail, UpdateCustomer, DeleteCustomer } = require('./usecases')

module.exports = fp(async function(fastify, opts) {
  const customersData = new MemoryCustomersData()
  const usecases = {
    createCustomer: new CreateCustomer(customersData),
    findCustomerById: new FindCustomerById(customersData),
    findCustomerByEmail: new FindCustomerByEmail(customersData),
    updateCustomer: new UpdateCustomer(customersData),
    deleteCustomer: new DeleteCustomer(customersData)
  }

  fastify.decorate('usecases', usecases)
})
