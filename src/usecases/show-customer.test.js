const CreateCustomer = require('./create-customer')
const ShowCustomer = require('./show-customer')
const { MemoryCustomersData } = require("../adapters/data")

test('show customer', async () => {
  const customersData = new MemoryCustomersData()
  const customer = {
    id: crypto.randomUUID(),
    name: 'John',
    email: 'john@example.com'
  }
  await (new CreateCustomer(customersData)).execute(customer)
  const useCase = new ShowCustomer(customersData)

  const res = await useCase.execute(customer.id)

  expect(res).toMatchObject(customer)
})

test('return null when customer not exists', async () => {
  const customersData = new MemoryCustomersData()
  const useCase = new ShowCustomer(customersData)

  const res = await useCase.execute(crypto.randomUUID())

  expect(res).toBeNull()
})
