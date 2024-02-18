const env = process.env

module.exports = {
  host: env.HOST || '127.0.0.1',
  port: env.PORT || 3000
}
