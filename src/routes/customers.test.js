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
