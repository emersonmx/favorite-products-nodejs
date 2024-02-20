const CreateCustomer = require('./create-customer')
const FindCustomerById = require('./find-customer-by-id')
const { MemoryCustomersData } = require("../adapters/data")

test('find customer', async () => {
  const customersData = new MemoryCustomersData()
  const customer = {
    id: crypto.randomUUID(),
    name: 'John',
    email: 'john@example.com'
  }
  await (new CreateCustomer(customersData)).execute(customer)
  const useCase = new FindCustomerById(customersData)

  const res = await useCase.execute(customer.id)

  expect(res).toMatchObject(customer)
})

test('return null when customer not exists', async () => {
  const customersData = new MemoryCustomersData()
  const useCase = new FindCustomerById(customersData)

  const res = await useCase.execute(crypto.randomUUID())

  expect(res).toBeNull()
})
