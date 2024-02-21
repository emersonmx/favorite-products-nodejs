const { MemoryCustomerProductListData } = require("../adapters/data/customer-product-list-data")
const UnfavoriteProduct = require("./unfavorite-product")

test('unfavorite', async () => {
  const productListData = new MemoryCustomerProductListData()
  const useCase = new UnfavoriteProduct(productListData)
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()
  await productListData.add(customerId, productId)

  await useCase.execute(customerId, productId)

  const pageAfter = await productListData.list({ customerId, page: 1, limit: 10 })
  expect(pageAfter.items).toHaveLength(0)
})

test('unfavorite unknown product', async () => {
  const productListData = new MemoryCustomerProductListData()
  const useCase = new UnfavoriteProduct(productListData)
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()
  const pageBefore = await productListData.list({ customerId, page: 1, limit: 10 })

  await useCase.execute(customerId, productId)

  const pageAfter = await productListData.list({ customerId, page: 1, limit: 10 })
  expect(pageAfter.items.length).toBe(pageBefore.items.length)
})
