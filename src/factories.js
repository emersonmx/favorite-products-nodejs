const fp = require('fastify-plugin')
const axios = require('axios')
const { MemoryCustomersData, MemoryCustomerProductListData } = require('./adapters/data')
const {
  CreateCustomer,
  DeleteCustomer,
  FavoriteProduct,
  FindCustomerByEmail,
  FindCustomerById,
  FindProductById,
  ListCustomerFavoriteProducts,
  UnfavoriteProduct,
  UpdateCustomer,
} = require('./usecases')
const { AxiosProductsApiClient, MemoryCachedProductsApiClient } = require('./adapters/client/products-api-client')

module.exports = fp(async function(fastify, opts) {
  const httpClient = axios.create()
  const customersData = new MemoryCustomersData()
  const customerProductListData = new MemoryCustomerProductListData()
  const axiosProductApiClient = new AxiosProductsApiClient(httpClient)
  const productsApiClient = new MemoryCachedProductsApiClient(axiosProductApiClient)
  const usecases = {
    createCustomer: new CreateCustomer(customersData),
    deleteCustomer: new DeleteCustomer(customersData),
    favoriteProduct: new FavoriteProduct(customerProductListData, productsApiClient),
    findCustomerByEmail: new FindCustomerByEmail(customersData),
    findCustomerById: new FindCustomerById(customersData),
    findProductById: new FindProductById(customerProductListData, productsApiClient),
    listCustomerFavoriteProducts: new ListCustomerFavoriteProducts(customerProductListData, productsApiClient),
    unfavoriteProduct: new UnfavoriteProduct(customerProductListData),
    updateCustomer: new UpdateCustomer(customersData)
  }

  fastify.decorate('usecases', usecases)
})
