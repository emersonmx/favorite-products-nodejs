const { MemoryCustomerProductListData } = require("../adapters/data/customer-product-list-data")
const FavoriteProduct = require("./favorite-product")
const Errors = require('./errors')
const { MemoryCachedProductsApiClient } = require("../adapters/client/products-api-client")

function makeMockClient() {
  return {
    findById: async (id) => {
      return {
        id,
        brand: 'a-brand',
        image: `http://example.com/images/${id}.jpg`,
        price: 1.99,
        reviewScore: 3.14,
        title: 'a-title'
      }
    }
  }
}

function makeUseCase() {
  const mockClient = makeMockClient()
  const productListData = new MemoryCustomerProductListData()
  const productApiClient = new MemoryCachedProductsApiClient(mockClient)
  return new FavoriteProduct(productListData, productApiClient)
}

test('favorite', async () => {
  const useCase = makeUseCase()
  useCase.productApiClient.findById = async (_) => null
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()

  await useCase.execute(customerId, productId)

  const res = await useCase.customerProductListData.list({ customerId, page: 1, limit: 10 })
  expect(res.items).toMatchObject([productId])
})

test('favorite same product', async () => {
  expect.assertions(1)
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()
  const useCase = makeUseCase()

  try {
    await useCase.execute(customerId, productId)
  } catch (error) {
    expect(error.message).toBe(Errors.NOT_EXISTS)
  }
})
