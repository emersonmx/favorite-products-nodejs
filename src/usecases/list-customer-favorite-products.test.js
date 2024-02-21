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
  const productsApiClient = new MemoryCachedProductsApiClient(mockClient)
  return new ListCustomerFavoriteProducts(productListData, productsApiClient)
}

function makeProducts(size) {
  return [...Array(size)].map(_ => crypto.randomUUID())
}

test('list products', async () => {
  const customerId = crypto.randomUUID()
  const products = makeProducts(10)
  const useCase = makeUseCase()
  const listProducts = await Promise.all(products.map(productId => {
    return useCase.productsApiClient.findById(productId)
  }))
  products.forEach(async (productId) => useCase.customerProductListData.add(customerId, productId))

  const res = await useCase.execute({ customerId, page: 1, limit: 2 })

  expect(res.items).toMatchObject(listProducts.slice(0, 2))
})

test('list empty products', async () => {
  const customerId = crypto.randomUUID()
  const useCase = makeUseCase()

  const res = await useCase.execute({ customerId, page: 1, limit: 2 })

  expect(res.items).toHaveLength(0)
})

test('list out of bounds products', async () => {
  const customerId = crypto.randomUUID()
  const useCase = makeUseCase()
  makeProducts(10).forEach(async (productId) => useCase.customerProductListData.add(customerId, productId))

  const res = await useCase.execute({ customerId, page: 0, limit: 2 })

  expect(res).toMatchObject({
    currentPage: 0,
    nextPage: null,
    previousPage: null,
    items: []
  })
})
