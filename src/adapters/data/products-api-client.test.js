const axios = require('axios')

const config = require('../../config')
const { AxiosProductsApiClient } = require('./products-api-client')

test('find a product by id', async () => {
  const client = new AxiosProductsApiClient(axios.create({
    baseURL: config.productsApiUrl
  }))
  const id = '79b1c283-00ef-6b22-1c8d-b0721999e2f0'

  const product = await client.findById(id)

  expect(product).toMatchObject({
    id,
    title: expect.any(String),
    price: expect.any(Number),
    brand: expect.any(String),
    image: expect.any(String),
    reviewScore: expect.any(Number),
  })
})

test('find a product by id without reviewScore', async () => {
  const client = new AxiosProductsApiClient(axios.create({
    baseURL: config.productsApiUrl
  }))
  const id = '69e2f68f-20cc-b9c0-8365-89928a2dcf88'

  const product = await client.findById(id)

  expect(product).toMatchObject({
    id,
    title: expect.any(String),
    price: expect.any(Number),
    brand: expect.any(String),
    image: expect.any(String),
  })
  expect(product.reviewScore).toBeUndefined()
})
