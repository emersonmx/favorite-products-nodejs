class ListCustomerFavoriteProducts {
  constructor(customerProductListData, productsApiClient) {
    this.customerProductListData = customerProductListData
    this.productsApiClient = productsApiClient
  }

  async execute({ customerId, page, limit }) {
    const pageData = await this.customerProductListData.list({ customerId, page, limit })
    const items = await Promise.all(pageData.items.map(productId => {
      return this.productsApiClient.findById(productId)
    }))
    return {
      ...pageData,
      items
    }
  }
}

module.exports = ListCustomerFavoriteProducts
