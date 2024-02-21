const { NOT_EXISTS } = require("./errors")

class FavoriteProduct {
  constructor(customerProductListData, productApiClient) {
    this.customerProductListData = customerProductListData
    this.productApiClient = productApiClient
  }

  async execute(customerId, productId) {
    const product = await this.productApiClient.findById(productId)
    if (product === null) {
      throw new Error(NOT_EXISTS)
    }

    await this.customerProductListData.add(customerId, productId)
  }
}

module.exports = FavoriteProduct
