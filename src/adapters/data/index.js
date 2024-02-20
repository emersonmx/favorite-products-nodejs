const { MemoryCustomersData } = require('./customers-data')
const { MemoryProductListData } = require('./product-list-data')
const { AxiosProductsApiClient, MemoryCachedProductsApiClient } = require('./products-api-client')

module.exports = {
  MemoryCustomersData,
  MemoryProductListData,
  AxiosProductsApiClient,
  MemoryCachedProductsApiClient
}
