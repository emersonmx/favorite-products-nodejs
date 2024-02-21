const { NOT_EXISTS } = require("./errors")

class FavoriteProduct {
  constructor(customerProductListData, productsApiClient) {
    this.customerProductListData = customerProductListData
    this.productsApiClient = productsApiClient
  }

  async execute(customerId, productId) {
    const product = await this.productsApiClient.findById(productId)
    if (product === null) {
      throw new Error(NOT_EXISTS)
    }

    await this.customerProductListData.add(customerId, productId)
  }
}

module.exports = FavoriteProduct
