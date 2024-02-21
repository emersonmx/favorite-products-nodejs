class FindProductById {
  constructor(customerProductListData, productsApiClient) {
    this.customerProductListData = customerProductListData
    this.productsApiClient = productsApiClient
  }

  async execute(customerId, productId) {
    const hasProduct = await this.customerProductListData.hasProduct(customerId, productId)
    if (!hasProduct) {
      return null
    }

    return await this.productsApiClient.findById(productId)
  }
}

module.exports = FindProductById
