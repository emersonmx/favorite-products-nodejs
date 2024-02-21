const { MemoryCustomerProductListData } = require("./customer-product-list-data")

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
