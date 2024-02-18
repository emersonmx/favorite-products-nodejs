const axios = require('axios')

axios.defaults.baseURL = 'http://127.0.0.1:3000'

test('create a new customer with name and email', async () => {
  const res = await axios.post('/customers', {
    name: 'John',
    email: 'john@example.com'
  })

  expect(res.status).toBe(201)
  expect(res.headers.location).toMatch(/\/customers\/(.+)$/)
})
