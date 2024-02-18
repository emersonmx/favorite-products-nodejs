const axios = require('axios')

test('create a new customer with name and email', async () => {
  const res = await axios.post('http://localhost:3000/customers', {
    name: 'John',
    email: 'john@example.com'
  })

  expect(res.status).toBe(201)
  expect(res.headers.location).toBe('http://localhost:3000/customers/1')
})
