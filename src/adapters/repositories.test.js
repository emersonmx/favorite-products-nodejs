const { MemoryCustomerRepository } = require("./repositories")
const { expect } = require('@jest/globals')

describe('MemoryCustomerRepository', () => {
  let repo

  beforeEach(() => {
    repo = new MemoryCustomerRepository()
  })

  test('create when email not exists', async () => {
    const customer = {
      id: crypto.randomUUID(),
      name: 'Jane',
      email: 'jane@example.com'
    }

    await repo.create(customer)

    expect(repo.database.get(customer.id)).toMatchObject(customer)
  })

  test('create when email exists', async () => {
    expect.assertions(1)

    const customer = {
      id: crypto.randomUUID(),
      name: 'Jane',
      email: 'jane@example.com'
    }
    await repo.create(customer)

    try {
      await repo.create(customer)
    } catch (error) {
      expect(error.message).toMatch('Email exists');
    }
  })

  test('find by id', async () => {
    const customer = {
      id: crypto.randomUUID(),
      name: 'Jane',
      email: 'jane@example.com'
    }
    await repo.create(customer)

    const res = await repo.findById(customer.id)

    expect(res).toMatchObject(customer)
  })

  test('update when email not exists', async () => {
    expect.assertions(1)

    const customer = { name: 'Jane Doe', email: 'janedoe@example.com' }

    try {
      await repo.update(crypto.randomUUID(), customer)
    } catch (error) {
      expect(error.message).toMatch('Customer not exists')
    }
  })

  test('update when use an email from another customer', async () => {
    expect.assertions(1)

    await repo.create({
      id: crypto.randomUUID(),
      name: 'John',
      email: 'john@example.com'
    })
    const customer = {
      id: crypto.randomUUID(),
      name: 'Jane',
      email: 'jane@example.com'
    }
    await repo.create(customer)

    const updatedCustomer = { name: 'John', email: 'john@example.com' }

    try {
      await repo.update(customer.id, updatedCustomer)
    } catch (error) {
      expect(error.message).toMatch('Email exists')
    }
  })

  test('update when is the same email', async () => {
    const customer = {
      id: crypto.randomUUID(),
      name: 'Jane',
      email: 'jane@example.com'
    }
    await repo.create(customer)

    const updatedCustomer = { name: 'Jane', email: 'jane@example.com' }

    await repo.update(customer.id, updatedCustomer)

    expect(repo.database.get(customer.id)).toMatchObject(customer)
  })

  test('delete when customer not exists', async () => {
    expect.assertions(1)

    try {
      await repo.delete(crypto.randomUUID())
    } catch (error) {
      expect(error.message).toMatch('Customer not exists')
    }
  })

  test('delete when customer exists', async () => {
    const customer = {
      id: crypto.randomUUID(),
      name: 'Jane',
      email: 'jane@example.com'
    }
    await repo.create(customer)

    await repo.delete(customer.id)

    expect(repo.database.get(customer.id)).toBeUndefined()
    expect(repo.emailIndex.has(customer.email)).toBeFalsy()
  })
})

