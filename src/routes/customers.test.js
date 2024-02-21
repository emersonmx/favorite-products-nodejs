const axios = require('axios')
const { createSigner } = require('fast-jwt')

const config = require('../config')

const signSync = createSigner({ key: config.adminJwtSecret })

const adminJwt = signSync({ sub: 'john@example.com', name: 'John' })

axios.defaults.baseURL = `http://${config.baseUrl}`
axios.defaults.headers.common.Authorization = `Bearer ${adminJwt}`
axios.defaults.validateStatus = () => {
  return true
}

function makeJohn() {
  const id = crypto.randomUUID()
  return {
    name: `John ${id}`,
    email: `john.${id}@example.com`
  }
}

describe('happy path', () => {
  test('create with name and email', async () => {
    const res = await axios.post('/customers', makeJohn())

    expect(res.status).toBe(201)
    expect(res.headers.location).toMatch(/\/customers\/(.+)$/)
  })

  test('show by id', async () => {
    const customer = makeJohn()
    const resCreate = await axios.post('/customers', customer)

    const res = await axios.get(resCreate.headers.location)

    expect(res.status).toBe(200)
    expect(res.data).toMatchObject(customer)
  })

  test('update name', async () => {
    const customer = makeJohn()
    const resCreate = await axios.post('/customers', customer)

    const res = await axios.put(resCreate.headers.location, {
      name: 'John Doe',
      email: customer.email
    })

    expect(res.status).toBe(200)
  })

  test('update email', async () => {
    const customer = makeJohn()
    const resCreate = await axios.post('/customers', customer)

    const res = await axios.put(resCreate.headers.location, {
      name: customer.name,
      email: `john.${crypto.randomUUID()}@example.com`
    })

    expect(res.status).toBe(200)
  })

  test('update name and email', async () => {
    const resCreate = await axios.post('/customers', makeJohn())

    const res = await axios.put(resCreate.headers.location, {
      name: 'John Doe',
      email: `johndoe.${crypto.randomUUID()}@example.com`
    })

    expect(res.status).toBe(200)
  })

  test('delete by id', async () => {
    const resCreate = await axios.post('/customers', makeJohn())

    const res = await axios.delete(resCreate.headers.location)

    expect(res.status).toBe(200)
  })
})

describe('response format', () => {
  test('check create', async () => {
    const res = await axios.post('/customers', makeJohn())

    expect(res.data).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
    })
  })

  test('check show', async () => {
    const resCreate = await axios.post('/customers', makeJohn())

    const res = await axios.get(resCreate.headers.location)

    expect(res.data).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
    })

  })
  test('check update', async () => {
    const resCreate = await axios.post('/customers', makeJohn())

    const res = await axios.put(resCreate.headers.location, {
      name: 'John Doe',
      email: `johndoe.${crypto.randomUUID()}@example.com`
    })

    expect(res.data).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
    })
  })

  test('check delete', async () => {
    const resCreate = await axios.post('/customers', makeJohn())

    const res = await axios.delete(resCreate.headers.location)

    expect(res.data).toHaveLength(0)
  })
})

describe('input errors', () => {
  describe('create', () => {
    test('return 400 when undefined name', async () => {
      const res = await axios.post('/customers', { email: 'john@example.com' })

      expect(res.status).toBe(400)
    })
    test('return 400 when null name', async () => {
      const res = await axios.post('/customers', { name: null, email: 'john@example.com' })

      expect(res.status).toBe(400)
    })
    test('return 400 when empty name', async () => {
      const res = await axios.post('/customers', { name: '', email: 'john@example.com' })

      expect(res.status).toBe(400)
    })

    test('return 400 when undefined email', async () => {
      const res = await axios.post('/customers', { name: 'John' })

      expect(res.status).toBe(400)
    })
    test('return 400 when null email', async () => {
      const res = await axios.post('/customers', { name: 'John', email: null })

      expect(res.status).toBe(400)
    })
    test('return 400 when empty email', async () => {
      const res = await axios.post('/customers', { name: 'John', email: '' })

      expect(res.status).toBe(400)
    })
  })

  describe('show', () => {
    test('return 404 when id not found', async () => {
      const invalidId = crypto.randomUUID()
      const res = await axios.get(`/customers/${invalidId}`)
      expect(res.status).toBe(404)
    })
  })

  describe('update', () => {
    test('return 400 when undefined name', async () => {
      const customer = makeJohn()
      const resCreate = await axios.post('/customers', customer)

      const res = await axios.put(resCreate.headers.location, { email: customer.email })

      expect(res.status).toBe(400)
    })
    test('return 400 when null name', async () => {
      const customer = makeJohn()
      const resCreate = await axios.post('/customers', customer)

      const res = await axios.put(resCreate.headers.location, { name: null, email: customer.email })

      expect(res.status).toBe(400)
    })
    test('return 400 empty name', async () => {
      const customer = makeJohn()
      const resCreate = await axios.post('/customers', customer)

      const res = await axios.put(resCreate.headers.location, { name: '', email: customer.email })

      expect(res.status).toBe(400)
    })

    test('return 400 when undefined email', async () => {
      const resCreate = await axios.post('/customers', makeJohn())

      const res = await axios.put(resCreate.headers.location, { name: 'John' })

      expect(res.status).toBe(400)
    })
    test('return 400 when null email', async () => {
      const resCreate = await axios.post('/customers', makeJohn())

      const res = await axios.put(resCreate.headers.location, { name: 'John', email: null })

      expect(res.status).toBe(400)
    })
    test('return 400 when empty email', async () => {
      const resCreate = await axios.post('/customers', makeJohn())

      const res = await axios.put(resCreate.headers.location, { name: 'John', email: '' })

      expect(res.status).toBe(400)
    })

    test('return 404 when id not found', async () => {
      const invalidId = crypto.randomUUID()

      const res = await axios.put(`/customers/${invalidId}`, makeJohn())

      expect(res.status).toBe(404)
    })
  })

  describe('delete', () => {
    test('return 404 when id not found', async () => {
      const invalidId = crypto.randomUUID()


      const res = await axios.delete(`/customers/${invalidId}`)
      expect(res.status).toBe(404)
    })
  })
})

describe('rules errors', () => {
  test('check creation of duplicate email.', async () => {
    const resJohn = await axios.post('/customers', makeJohn())
    const resJohnDoe = await axios.post('/customers', {
      name: 'John Doe',
      email: resJohn.data.email
    })

    expect(resJohn.status).toBe(201)
    expect(resJohnDoe.status).toBe(409)
  })

  test('update to an email that already exists', async () => {
    const resJohn = await axios.post('/customers', makeJohn())
    const resJohnDoe = await axios.post('/customers', {
      name: 'John Doe',
      email: `johndoe.${crypto.randomUUID()}@example.com`
    })

    const res = await axios.put(resJohnDoe.headers.location, {
      name: 'John Doe',
      email: resJohn.data.email
    })

    expect(resJohn.status).toBe(201)
    expect(resJohnDoe.status).toBe(201)
    expect(res.status).toBe(409)
  })

  test('update when email is the same', async () => {
    const resJohn = await axios.post('/customers', makeJohn())
    const resJohnDoe = await axios.post('/customers', {
      name: 'John Doe',
      email: `johndoe.${crypto.randomUUID()}@example.com`
    })

    const res = await axios.put(resJohnDoe.headers.location, {
      name: 'John Doe Jr',
      email: resJohnDoe.data.email
    })

    expect(resJohn.status).toBe(201)
    expect(resJohnDoe.status).toBe(201)
    expect(res.status).toBe(200)
  })
})

describe('invalid JWT', () => {
  let session

  beforeAll(() => {
    session = axios.create({
      headers: {
        Authorization: null
      }
    })
  })

  test('return 401 when create', async () => {
    const res = await session.post('/customers', makeJohn())

    expect(res.status).toBe(401)
  })

  test('return 401 when show', async () => {
    const id = crypto.randomUUID()

    const res = await session.get(`/customers/${id}`)

    expect(res.status).toBe(401)
  })

  test('return 401 when update', async () => {
    const id = crypto.randomUUID()

    const res = await session.put(`/customers/${id}`, {
      name: 'John Doe',
      email: `johndoe.${crypto.randomUUID()}@example.com`
    })

    expect(res.status).toBe(401)
  })

  test('return 401 when delete', async () => {
    const id = crypto.randomUUID()

    const res = await session.delete(`/customers/${id}`)

    expect(res.status).toBe(401)
  })
})
