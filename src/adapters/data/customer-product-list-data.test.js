const { Errors } = require("../../usecases")
const { MemoryCustomerProductListData } = require("./customer-product-list-data")

test('add a product', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()

  await productListData.add(customerId, productId)

  expect(productListData.database.get(customerId)).toMatchObject(new Set([productId]))
})

test('add the same product', async () => {
  expect.assertions(1)
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()
  await productListData.add(customerId, productId)

  try {
    await productListData.add(customerId, productId)
  } catch (error) {
    expect(error.message).toBe(Errors.INTEGRITY_ERROR)
  }
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

test('has product', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()
  await productListData.add(customerId, productId)

  const res = await productListData.hasProduct(customerId, productId)

  expect(res).toBeTruthy()
})

test('has not a product', async () => {
  const productListData = new MemoryCustomerProductListData()
  const customerId = crypto.randomUUID()

  const res = await productListData.hasProduct(customerId, crypto.randomUUID())

  expect(res).toBeFalsy()
})
