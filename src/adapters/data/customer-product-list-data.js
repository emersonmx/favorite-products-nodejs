class MemoryCustomerProductListData {
  constructor() {
    this.database = new Map()
  }

  async list({ customerId, page, limit }) {
    const items = (this.database.get(customerId) || new Set())
    const currentPage = page
    const nextPage = this.nextPage(items.size, page, limit)
    const previousPage = this.previousPage(items.size, page, limit)
    const offset = (page - 1) * limit
    return {
      currentPage,
      nextPage,
      previousPage,
      items: Array.from(items).slice(offset, offset + limit)
    }
  }

  nextPage(count, page, limit) {
    if (page < 1) {
      return null
    }
    const offset = page * limit
    if (offset >= count) {
      return null
    }
    return page + 1
  }

  previousPage(count, page, limit) {
    if ((page - 1) < 1) {
      return null
    }
    const offset = (page - 1) * limit
    if (offset >= count) {
      return null
    }

    return page - 1
  }

  async hasProduct(customerId, productId) {
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
    if (!await this.hasProduct(customerId, productId)) {
      return
    }

    this.database.get(customerId).delete(productId)
  }
}
module.exports = {
  MemoryCustomerProductListData
}
