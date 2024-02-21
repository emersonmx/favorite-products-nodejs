class ListFavoriteProducts {
  constructor(customerProductListData, productApiClient) {
    this.customerProductListData = customerProductListData
    this.productApiClient = productApiClient
  }

  async execute({ customerId, page, limit }) {
    const pageData = await this.customerProductListData.list({ customerId, page, limit })
    const items = await Promise.all(pageData.items.map(productId => {
      return this.productApiClient.findById(productId)
    }))
    return {
      ...pageData,
      items
    }
  }
}

module.exports = ListFavoriteProducts
