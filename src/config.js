const env = process.env

export default {
  host: env.HOST || '127.0.0.1',
  port: env.PORT || 3000
}
