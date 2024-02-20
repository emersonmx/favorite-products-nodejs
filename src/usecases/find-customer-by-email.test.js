const CreateCustomer = require('./create-customer')
const FindCustomerByEmail = require('./find-customer-by-email')
const { MemoryCustomersData } = require("../adapters/data")

test('find customer', async () => {
  const customersData = new MemoryCustomersData()
  const customer = {
    id: crypto.randomUUID(),
    name: 'John',
    email: 'john@example.com'
  }
  await (new CreateCustomer(customersData)).execute(customer)
  const useCase = new FindCustomerByEmail(customersData)

  const res = await useCase.execute(customer.email)

  expect(res).toMatchObject(customer)
})

test('return null when customer not exists', async () => {
  const customersData = new MemoryCustomersData()
  const useCase = new FindCustomerByEmail(customersData)

  const res = await useCase.execute('john@example.com')

  expect(res).toBeNull()
})
