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

  hasProduct(customerId, productId) {
    const products = this.database.get(customerId) || new Set()
    return products.has(productId)
  }

  async add(customerId, productId) {
    if (!this.database.has(customerId)) {
      this.database.set(customerId, new Set())
    }

    this.database.get(customerId).add(productId)
  }

  async delete(customerId, productId) {
    if (!this.hasProduct(customerId, productId)) {
      return
    }

    this.database.get(customerId).delete(productId)
  }
}
module.exports = {
  MemoryCustomerProductListData
}
