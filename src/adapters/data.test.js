const { MemoryCustomersData } = require("./data")
const { Errors } = require("../usecases")

describe('MemoryCustomersData', () => {
  test('create when email not exists', async () => {
    const repo = new MemoryCustomersData()
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

    const repo = new MemoryCustomersData()
    const customer = {
      id: crypto.randomUUID(),
      name: 'Jane',
      email: 'jane@example.com'
    }
    await repo.create(customer)

    try {
      await repo.create(customer)
    } catch (error) {
      expect(error.message).toMatch(Errors.INTEGRITY_ERROR);
    }
  })

  test('find by id', async () => {
    const repo = new MemoryCustomersData()
    const customer = {
      id: crypto.randomUUID(),
      name: 'Jane',
      email: 'jane@example.com'
    }
    await repo.create(customer)

    const res = await repo.findById(customer.id)

    expect(res).toMatchObject(customer)
  })

  test('find by email', async () => {
    const repo = new MemoryCustomersData()
    const customer = {
      id: crypto.randomUUID(),
      name: 'Jane',
      email: 'jane@example.com'
    }
    await repo.create(customer)

    const res = await repo.findByEmail(customer.email)

    expect(res).toMatchObject(customer)
  })

  test('update when email not exists', async () => {
    const repo = new MemoryCustomersData()
    const customer = { name: 'Jane Doe', email: 'janedoe@example.com' }

    await repo.update(crypto.randomUUID(), customer)

    expect(repo.database.size).toBe(0)
  })

  test('update when use an email from another customer', async () => {
    expect.assertions(1)

    const repo = new MemoryCustomersData()
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
      expect(error.message).toMatch(Errors.INTEGRITY_ERROR)
    }
  })

  test('update when is the same email', async () => {
    const repo = new MemoryCustomersData()
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
    const repo = new MemoryCustomersData()
    const beforeSize = repo.database.size

    await repo.delete(crypto.randomUUID())

    expect(repo.database.size).toBe(beforeSize)
  })

  test('delete when customer exists', async () => {
    const repo = new MemoryCustomersData()
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

