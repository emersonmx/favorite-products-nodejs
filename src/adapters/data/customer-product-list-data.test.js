const { MemoryCustomerProductListData } = require("./customer-product-list-data")

function makeProducts(size) {
  return [...Array(size)].map(_ => crypto.randomUUID())
}

test('add a product', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()

  await productListData.add(customerId, productId)

  expect(productListData.database.get(customerId)).toMatchObject(new Set([productId]))
})

test('add the same product', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()
  await productListData.add(customerId, productId)
  const beforeSize = productListData.database.size

  await productListData.add(customerId, productId)

  expect(productListData.database.size).toBe(beforeSize)
})

test('delete a product', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()
  await productListData.add(customerId, productId)

  await productListData.delete(customerId, productId)

  expect(productListData.database.get(customerId)).toMatchObject(new Set())
})

test('delete a product when it does not exist', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()
  const productsBefore = productListData.database.get(customerId)

  await productListData.delete(customerId, productId)

  expect(productListData.database.get(customerId)).toBe(productsBefore)
})

test('list empty products', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()

  const res = await productListData.list({ customerId, page: 1, limit: 10 })

  expect(res.items).toHaveLength(0)
})

test('list products', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const products = makeProducts(5)
  products.forEach(async (p) => await productListData.add(customerId, p))

  const res = await productListData.list({ customerId, page: 1, limit: 10 })

  expect(res.items).toMatchObject(products)
})

test('first page format', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const products = makeProducts(10)
  products.forEach(async (p) => await productListData.add(customerId, p))

  const res = await productListData.list({ customerId, page: 1, limit: 2 })

  expect(res).toMatchObject({
    currentPage: 1,
    nextPage: 2,
    previousPage: null,
    items: products.slice(0, 2)
  })
})

test('middle page format', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const products = makeProducts(10)
  products.forEach(async (p) => await productListData.add(customerId, p))

  const res = await productListData.list({ customerId, page: 2, limit: 2 })
  expect(res).toMatchObject({
    currentPage: 2,
    nextPage: 3,
    previousPage: 1,
    items: products.slice(2, 4)
  })
})

test('last page format', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const products = makeProducts(10)
  products.forEach(async (p) => await productListData.add(customerId, p))

  const res = await productListData.list({ customerId, page: 5, limit: 2 })

  expect(res).toMatchObject({
    currentPage: 5,
    nextPage: null,
    previousPage: 4,
    items: products.slice(8, 10)
  })
})

test('current page before first page format', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const products = makeProducts(10)
  products.forEach(async (p) => await productListData.add(customerId, p))

  const res = await productListData.list({ customerId, page: 0, limit: 2 })
  expect(res).toMatchObject({
    currentPage: 0,
    nextPage: null,
    previousPage: null,
    items: []
  })
})

test('current page after last page format', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const products = makeProducts(10)
  products.forEach(async (p) => await productListData.add(customerId, p))

  const res = await productListData.list({ customerId, page: 6, limit: 2 })
  expect(res).toMatchObject({
    currentPage: 6,
    nextPage: null,
    previousPage: null,
    items: []
  })
})
