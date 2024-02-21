(async () => {
  const axios = require('axios')
  const path = require('path')
  const { createSigner } = require('fast-jwt')
  const config = require(path.resolve(__dirname, '../src/config'))

  const adminSignSync = createSigner({ key: config.adminJwtSecret })

  const adminJwt = adminSignSync({ name: 'Admin', email: 'admin@example.com' })

  const signSync = createSigner({ key: config.customerJwtSecret })

  const hash = crypto.randomUUID()
  const customer = { name: `John ${hash}`, email: `john.${hash}@example.com` }
  const res = await axios.post(`http://${config.baseUrl}/customers`, customer, {
    headers: {
      Authorization: `Bearer ${adminJwt}`,
    }
  })

  const { id, name } = res.data
  const key = signSync({ sub: id, name })

  console.log(key)
  console.log(res.data)
})()
