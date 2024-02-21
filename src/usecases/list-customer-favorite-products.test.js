const { MemoryCustomerProductListData } = require("../adapters/data/customer-product-list-data")
const ListCustomerFavoriteProducts = require("./list-customer-favorite-products")
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
  return new ListCustomerFavoriteProducts(productListData, productApiClient)
}

function makeProducts(size) {
  return [...Array(size)].map(_ => crypto.randomUUID())
}

test('list products', async () => {
  const customerId = crypto.randomUUID()
  const products = makeProducts(10)
  const useCase = makeUseCase()
  const listProducts = await Promise.all(products.map(productId => {
    return useCase.productApiClient.findById(productId)
  }))
  products.forEach(async (productId) => useCase.customerProductListData.add(customerId, productId))

  const res = await useCase.execute({ customerId, page: 1, limit: 2 })

  expect(res.items).toMatchObject(listProducts.slice(0, 2))
})
