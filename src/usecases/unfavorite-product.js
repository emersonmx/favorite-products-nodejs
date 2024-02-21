class UnfavoriteProduct {
  constructor(customerProductListData) {
    this.customerProductListData = customerProductListData
  }

  async execute(customerId, productId) {
    await this.customerProductListData.delete(customerId, productId)
  }
}

module.exports = UnfavoriteProduct
