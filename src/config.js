const env = process.env

const version = env.VERSION || '0.1.0'
const host = env.HOST || '127.0.0.1'
const port = env.PORT || 3000
const baseUrl = `${host}:${port}`
const adminJwtSecret = env.ADMIN_JWT_SECRET
const adminEmails = env.ADMIN_EMAILS.split(',') || []
const customerJwtSecret = env.CUSTOMER_JWT_SECRET
const productsApiUrl = env.PRODUCTS_API_URL || 'http://challenge-api.luizalabs.com/api/product'

module.exports = {
  version,
  host,
  port,
  baseUrl,
  adminJwtSecret,
  adminEmails,
  customerJwtSecret,
  productsApiUrl
}
