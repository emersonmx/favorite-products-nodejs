const { Errors } = require("../../usecases")

class MemoryCustomerProductListData {
  constructor() {
    this.database = new Map()
  }

  async list(customerId) {
    return {
      links: {},
      products: []
    }
  }

  async hasProduct(customerId, productId) {
    const products = this.database.get(customerId) || new Set()
    return products.has(productId)
  }

  async add(customerId, productId) {
    if (!this.database.has(customerId)) {
      this.database.set(customerId, new Set())
    }

    if (await this.hasProduct(customerId, productId)) {
      throw new Error(Errors.INTEGRITY_ERROR)
    }

    this.database.get(customerId).add(productId)
  }

  async delete(customerId, productId) {
    if (!await this.hasProduct(customerId, productId)) {
      return
    }

    this.database.get(customerId).delete(productId)
  }
}
module.exports = {
  MemoryCustomerProductListData
}
