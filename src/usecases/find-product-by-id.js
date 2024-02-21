class FindProductById {
  constructor(customerProductListData, productApiClient) {
    this.customerProductListData = customerProductListData
    this.productApiClient = productApiClient
  }

  async execute(customerId, productId) {
    const hasProduct = await this.customerProductListData.hasProduct(customerId, productId)
    if (!hasProduct) {
      return null
    }

    return await this.productApiClient.findById(productId)
  }
}

module.exports = FindProductById
