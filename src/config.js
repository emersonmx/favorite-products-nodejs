const env = process.env

const version = env.VERSION || '0.1.0'
const host = env.HOST || '127.0.0.1'
const port = env.PORT || 3000
const baseUrl = `${host}:${port}`

module.exports = {
  version,
  host,
  port,
  baseUrl
}
