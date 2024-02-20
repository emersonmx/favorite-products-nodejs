class MemoryProductListData {
  constructor() {
    this.database = new Map()
  }

  async list(id) {
    return {
      links: {},
      products: []
    }
  }

  async findById(id) {
    return this.database.get(id) || null
  }

  async create({ id, name, email }) {
    this.database.set(id, { id, name, email })
  }

  async delete(id) {
    if (!this.database.has(id)) {
      return
    }

    const customer = this.database.get(id)
    this.database.delete(customer.id)
  }
}
module.exports = {
  MemoryProductListData
}
