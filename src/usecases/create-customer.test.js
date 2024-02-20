const CreateCustomer = require('./create-customer')
const { MemoryCustomersData } = require("../adapters/data")

test('create a customer', async () => {
  const customersData = new MemoryCustomersData()
  const useCase = new CreateCustomer(customersData)
  const customer = {
    id: crypto.randomUUID(),
    name: 'John',
    email: 'john@example.com'
  }

  await useCase.execute(customer)

  expect(await customersData.findById(customer.id)).toMatchObject(customer)
})
