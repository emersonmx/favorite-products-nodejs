const env = process.env

const host = env.HOST || '127.0.0.1'
const port = env.PORT || 3000
const baseUrl = `${host}:${port}`

module.exports = {
  host,
  port,
  baseUrl
}
