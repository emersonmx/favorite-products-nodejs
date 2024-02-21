(async () => {
  const path = require('path')
  const { createSigner } = require('fast-jwt')
  const config = require(path.resolve(__dirname, '../src/config'))

  const adminSignSync = createSigner({ key: config.adminJwtSecret })

  const key = adminSignSync({ sub: 'admin@example.com', name: 'Admin' })

  console.log(key)
})()
