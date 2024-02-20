const CreateCustomer = require('./create-customer')
const UpdateCustomer = require('./update-customer')
const { MemoryCustomersData } = require("../adapters/data")
const Errors = require('./errors')

test('update customer', async () => {
  const customersData = new MemoryCustomersData()
  const customer = {
    id: crypto.randomUUID(),
    name: 'John',
    email: 'john@example.com'
  }
  await (new CreateCustomer(customersData)).execute(customer)
  const updatedCustomer = {
    name: 'John Doe',
    email: 'johndoe@example.com'
  }
  const useCase = new UpdateCustomer(customersData)

  await useCase.execute(customer.id, updatedCustomer)

  expect(await customersData.findById(customer.id)).toMatchObject(updatedCustomer)
})

test('update to an email that already exists', async () => {
  expect.assertions(1)
  const customersData = new MemoryCustomersData()
  const john = {
    id: crypto.randomUUID(),
    name: 'John',
    email: 'john@example.com'
  }
  const johnDoe = {
    id: crypto.randomUUID(),
    name: 'John Doe',
    email: 'johndoe@example.com'
  }
  await (new CreateCustomer(customersData)).execute(john)
  await (new CreateCustomer(customersData)).execute(johnDoe)
  const updatedCustomer = {
    name: 'John Doe',
    email: john.email
  }
  const useCase = new UpdateCustomer(customersData)

  try {
    await useCase.execute(johnDoe.id, updatedCustomer)
  } catch (error) {
    expect(error.message).toBe(Errors.INTEGRITY_ERROR)
  }
})

test('update when email is the same', async () => {
  const customersData = new MemoryCustomersData()
  const customer = {
    id: crypto.randomUUID(),
    name: 'John',
    email: 'john@example.com'
  }
  await (new CreateCustomer(customersData)).execute(customer)
  const updatedCustomer = {
    name: 'John Doe',
    email: customer.email
  }
  const useCase = new UpdateCustomer(customersData)

  await useCase.execute(customer.id, updatedCustomer)

  expect(await customersData.findById(customer.id)).toMatchObject(updatedCustomer)
})

test('update customer when not exists', async () => {
  const id = crypto.randomUUID()
  const customersData = new MemoryCustomersData()
  const useCase = new UpdateCustomer(customersData)

  await useCase.execute(id, { name: 'John', email: 'john@example.com' })

  expect(await customersData.findById(id)).toBeNull()
})
