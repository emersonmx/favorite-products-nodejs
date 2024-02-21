const axios = require('axios')
const { createSigner } = require('fast-jwt')

const config = require('../config')

const adminSignSync = createSigner({ key: config.adminJwtSecret })

const adminJwt = adminSignSync({ sub: 'admin@example.com', name: 'Admin' })

const adminAxios = axios.create({
  baseURL: `http://${config.baseUrl}`,
  headers: {
    Authorization: `Bearer ${adminJwt}`,
  },
  validateStatus: () => {
    return true
  }
})

function makeCustomerAxios(customer) {
  const customerSignSync = createSigner({ key: config.customerJwtSecret })
  const customerJwt = customerSignSync({ sub: customer.id, name: customer.name })
  return axios.create({
    baseURL: `http://${config.baseUrl}`,
    headers: {
      Authorization: `Bearer ${customerJwt}`,
    },
    validateStatus: () => {
      return true
    }
  })
}

async function createCustomer() {
  const hash = crypto.randomUUID()
  const res = await adminAxios.post('/customers', {
    name: `John ${hash}`,
    email: `john.${hash}@example.com`
  })
  return res.data
}

test('favorite product', async () => {
  const productId = '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
  const customerAxios = makeCustomerAxios(await createCustomer())

  const res = await customerAxios.post('/product-list', {
    id: productId
  })

  expect(res.status).toBe(201)
  expect(res.data).toMatchObject({
    id: productId,
    title: expect.any(String),
    price: expect.any(Number),
    brand: expect.any(String),
    image: expect.any(String),
  })
})

test('favorite unknown product', async () => {
  const productId = crypto.randomUUID()
  const customerAxios = makeCustomerAxios(await createCustomer())

  const res = await customerAxios.post('/product-list', {
    id: productId
  })

  expect(res.status).toBe(404)
})

test('show favorite product', async () => {
  const productId = '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
  const customerAxios = makeCustomerAxios(await createCustomer())
  const favoriteRes = await customerAxios.post('/product-list', {
    id: productId
  })

  const res = await customerAxios.get(favoriteRes.headers.location)

  expect(res.status).toBe(200)
  expect(res.data).toMatchObject({
    id: productId,
    title: expect.any(String),
    price: expect.any(Number),
    brand: expect.any(String),
    image: expect.any(String),
  })
})

test('unfavorite product', async () => {
  const productId = '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
  const customerAxios = makeCustomerAxios(await createCustomer())
  const favoriteRes = await customerAxios.post('/product-list', {
    id: productId
  })

  const res = await customerAxios.delete(favoriteRes.headers.location)

  expect(res.status).toBe(200)
})

test('unfavorite unknown product', async () => {
  const productId = crypto.randomUUID()
  const customerAxios = makeCustomerAxios(await createCustomer())
  const favoriteRes = await customerAxios.post('/product-list', {
    id: productId
  })

  const res = await customerAxios.delete(favoriteRes.headers.location)

  expect(res.status).toBe(404)
})

test('list products', async () => {
  const products = [
    '1bf0f365-fbdd-4e21-9786-da459d78dd1f',
    '958ec015-cfcf-258d-c6df-1721de0ab6ea',
    '6a512e6c-6627-d286-5d18-583558359ab6',
    '4bd442b1-4a7d-2475-be97-a7b22a08a024',
    '77be5ad3-fa87-d8a0-9433-5dbcc3152fac',
    '356eafd9-224a-d242-a3f2-e29b4270a927',
    '212d0f07-8f56-0708-971c-41ee78aadf2b',
    '2b505fab-d865-e164-345d-efbd4c2045b6',
    'ee9fc710-8876-c40c-7862-275e237d84a4',
    '432c3f2a-bcae-e709-4ad6-4ea71f4aa4f7',
  ]
  const customerAxios = makeCustomerAxios(await createCustomer())
  await Promise.all(products.map(productId => {
    return customerAxios.post('/product-list', { id: productId })
  }))

  const res = await customerAxios.get('/product-list', {
    params: {
      page: 1,
      limit: 10
    }
  })

  expect(res.status).toBe(200)
  expect(res.data).toMatchObject({
    currentPage: expect.any(String),
    nextPage: null,
    previousPage: null,
    products: expect.any(Array)
  })
})

test('validate list query everything is missing', async () => {
  const customerAxios = makeCustomerAxios(await createCustomer())

  const res = await customerAxios.get('/product-list')

  expect(res.status).toBe(400)
})

test('validate list query when page is missing', async () => {
  const customerAxios = makeCustomerAxios(await createCustomer())

  const res = await customerAxios.get('/product-list', {
    params: { limit: 10 }
  })


  expect(res.status).toBe(400)
})

test('validate list query when limit is missing', async () => {
  const customerAxios = makeCustomerAxios(await createCustomer())

  const res = await customerAxios.get('/product-list', {
    params: { page: 1 }
  })

  expect(res.status).toBe(400)
})

test('validate list query when page is less than minimum', async () => {
  const customerAxios = makeCustomerAxios(await createCustomer())

  const res = await customerAxios.get('/product-list', {
    params: {
      page: 0,
      limit: 10
    }
  })

  expect(res.status).toBe(400)
})

test('validate list query when page is greater than maximum', async () => {
  const customerAxios = makeCustomerAxios(await createCustomer())

  const res = await customerAxios.get('/product-list', {
    params: {
      page: 1000,
      limit: 10
    }
  })

  expect(res.status).toBe(200)
  expect(res.data).toMatchObject({
    currentPage: expect.any(String),
    nextPage: null,
    previousPage: null,
    products: expect.any(Array)
  })
})

test('validate list query when limit is less than minimum', async () => {
  const customerAxios = makeCustomerAxios(await createCustomer())

  const res = await customerAxios.get('/product-list', {
    params: {
      page: 1,
      limit: 0
    }
  })

  expect(res.status).toBe(400)
})

test('validate list query when limit is greater than maximum', async () => {
  const customerAxios = makeCustomerAxios(await createCustomer())

  const res = await customerAxios.get('/product-list', {
    params: {
      page: 1,
      limit: 1000
    }
  })

  expect(res.status).toBe(400)
})
