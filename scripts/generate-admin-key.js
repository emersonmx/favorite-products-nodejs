(async () => {
  const path = require('path')
  const { createSigner } = require('fast-jwt')
  const config = require(path.resolve(__dirname, '../src/config'))

  const adminSignSync = createSigner({ key: config.adminJwtSecret })

  const key = adminSignSync({ name: 'Admin', email: 'admin@example.com' })

  console.log(key)
})()
