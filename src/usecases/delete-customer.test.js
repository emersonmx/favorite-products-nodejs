const CreateCustomer = require('./create-customer')
const DeleteCustomer = require('./delete-customer')
const { MemoryCustomersData } = require("../adapters/data")

test('delete customer', async () => {
  const customersData = new MemoryCustomersData()
  const customer = {
    id: crypto.randomUUID(),
    name: 'John',
    email: 'john@example.com'
  }
  await (new CreateCustomer(customersData)).execute(customer)
  const useCase = new DeleteCustomer(customersData)

  await useCase.execute(customer.id)

  expect(await customersData.findById(customer.id)).toBeNull()
})

test('delete when customer not exists', async () => {
  const customersData = new MemoryCustomersData()
  const customer = {
    id: crypto.randomUUID(),
    name: 'John',
    email: 'john@example.com'
  }
  const beforeExecute = await customersData.findByEmail(customer.email)
  const useCase = new DeleteCustomer(customersData)

  await useCase.execute(customer.id)

  expect(await customersData.findByEmail(customer.email)).toBe(beforeExecute)
})
