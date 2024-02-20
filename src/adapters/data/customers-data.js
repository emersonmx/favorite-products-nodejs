const { Errors } = require("../../usecases")

class MemoryCustomersData {
  constructor() {
    this.database = new Map()
    this.emailIndex = new Map()
  }

  async findById(id) {
    return this.database.get(id) || null
  }

  async findByEmail(email) {
    const id = this.emailIndex.get(email)
    if (id === undefined) {
      return null
    }
    return this.database.get(id) || null
  }

  async create({ id, name, email }) {
    if (this.emailIndex.has(email)) {
      throw new Error(Errors.INTEGRITY_ERROR)
    }

    this.database.set(id, { id, name, email })
    this.emailIndex.set(email, id)
  }

  async update(id, { name, email }) {
    if (!this.database.has(id)) {
      return
    }

    const isSameEmail = this.database.get(id).email === email
    const hasEmail = this.emailIndex.has(email)
    if (hasEmail && !isSameEmail) {
      throw new Error(Errors.INTEGRITY_ERROR)
    }

    this.database.set(id, { id, name, email })
    this.emailIndex.set(email, id)
  }

  async delete(id) {
    if (!this.database.has(id)) {
      return
    }

    const customer = this.database.get(id)
    this.database.delete(customer.id)
    this.emailIndex.delete(customer.email)
  }
}

module.exports = {
  MemoryCustomersData
}
