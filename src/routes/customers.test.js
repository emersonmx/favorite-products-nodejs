const axios = require('axios')
const { expect } = require('@jest/globals')

axios.defaults.baseURL = 'http://127.0.0.1:3000'
axios.defaults.validateStatus = () => {
  return true
}

describe('happy path', () => {
  let resCreate

  beforeAll(async () => {
    resCreate = await axios.post('/customers', {
      name: 'John',
      email: 'john@example.com'
    })
  })

  afterAll(async () => {
    await axios.delete(resCreate.headers.location)
  })

  test('create with name and email', async () => {
    expect(resCreate.status).toBe(201)
    expect(resCreate.headers.location).toMatch(/\/customers\/(.+)$/)
  })

  test('show by id', async () => {
    const res = await axios.get(resCreate.headers.location)

    expect(res.status).toBe(200)
    expect(res.data).toMatchObject({ name: 'John', email: 'john@example.com' })
  })

  test('update name and email', async () => {
    const res = await axios.put(resCreate.headers.location, {
      name: 'John Doe',
      email: 'johndoe@example.com'
    })

    expect(res.status).toBe(200)
  })

  test('delete by id', async () => {
    const resDelete = await axios.delete(resCreate.headers.location)
    const resShow = await axios.get(resCreate.headers.location)

    expect(resDelete.status).toBe(200)
    expect(resShow.status).toBe(404)
  })
})

describe('response format', () => {
  let resCreate

  beforeAll(async () => {
    resCreate = await axios.post('/customers', {
      name: 'John',
      email: 'john@example.com'
    })
  })

  afterAll(async () => {
    await axios.delete(resCreate.headers.location)
  })

  test('check create', async () => {
    expect(resCreate.data).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
    })
  })

  test('check show', async () => {
    const res = await axios.get(resCreate.headers.location)

    expect(res.data).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
    })

  })
  test('check update', async () => {
    const res = await axios.put(resCreate.headers.location, {
      name: 'John Doe',
      email: 'johndoe@example.com'
    })

    expect(res.data).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
    })
  })

  test('check delete', async () => {
    const res = await axios.delete(resCreate.headers.location)

    expect(res.data).toHaveLength(0)
  })
})

describe('input errors', () => {
  let createdUrl

  beforeAll(async () => {
    const res = await axios.post('/customers', {
      name: 'John',
      email: 'john@example.com'
    })
    createdUrl = res.headers.location
  })

  afterAll(async () => {
    await axios.delete(createdUrl)
  })

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
      const res = await axios.put(createdUrl, { email: 'john@example.com' })

      expect(res.status).toBe(400)
    })
    test('return 400 when null name', async () => {
      const res = await axios.put(createdUrl, { name: null, email: 'john@example.com' })

      expect(res.status).toBe(400)
    })
    test('return 400 empty name', async () => {
      const res = await axios.put(createdUrl, { name: '', email: 'john@example.com' })

      expect(res.status).toBe(400)
    })

    test('return 400 when undefined email', async () => {
      const res = await axios.put(createdUrl, { name: 'John' })

      expect(res.status).toBe(400)
    })
    test('return 400 when null email', async () => {
      const res = await axios.put(createdUrl, { name: 'John', email: null })

      expect(res.status).toBe(400)
    })
    test('return 400 when empty email', async () => {
      const res = await axios.put(createdUrl, { name: 'John', email: '' })

      expect(res.status).toBe(400)
    })

    test('return 404 when id not found', async () => {
      const invalidId = crypto.randomUUID()
      const res = await axios.put(`/customers/${invalidId}`, { name: 'John', email: 'john@example.com' })
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
