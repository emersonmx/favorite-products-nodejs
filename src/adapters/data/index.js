const { MemoryCustomersData } = require('./customers-data')
const { MemoryProductsData } = require('./product-list-data')
const { AxiosProductsApiClient, MemoryCachedProductsApiClient } = require('./products-api-client')

module.exports = {
  MemoryCustomersData,
  MemoryProductsData,
  AxiosProductsApiClient,
  MemoryCachedProductsApiClient
}
