const { MemoryCustomerProductListData } = require("../adapters/data/customer-product-list-data")
const FindProductById = require("./find-product-by-id")
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
  const productsApiClient = new MemoryCachedProductsApiClient(mockClient)
  return new FindProductById(productListData, productsApiClient)
}

test('find a favorite product', async () => {
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()
  const useCase = makeUseCase()
  await useCase.customerProductListData.add(customerId, productId)

  const res = await useCase.execute(customerId, productId)

  expect(res).toMatchObject({
    id: productId,
    title: expect.any(String),
    price: expect.any(Number),
    brand: expect.any(String),
    image: expect.any(String),
    reviewScore: expect.any(Number),
  })
})

test('find a non-favorite product', async () => {
  const customerId = crypto.randomUUID()
  const productId = crypto.randomUUID()
  const useCase = makeUseCase()

  const res = await useCase.execute(customerId, productId)

  expect(res).toBeNull()
})
