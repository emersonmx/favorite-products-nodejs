(async () => {
  const path = require('path')
  const { createSigner } = require('fast-jwt')
  const config = require(path.resolve(__dirname, '../src/config'))

  const signSync = createSigner({ key: config.adminJwtSecret })

  const key = signSync({ sub: 'admin@example.com', name: 'Admin' })

  console.log(key)
})()
