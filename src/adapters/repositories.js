class MemoryCustomerRepository {
  constructor(database) {
    this.database = database
    this.emailIndex = new Set([...database.values()].map(c => c.email))
  }

  async findById(id) {
    return this.database.get(id)
  }

  async create({ id, name, email }) {
    if (this.emailIndex.has(email)) {
      throw new Error('Email exists')
    }

    this.database.set(id, { id, name, email })
    this.emailIndex.add(email)
  }

  async update(id, { name, email }) {
    if (!this.database.has(id)) {
      throw new Error('Customer not exists')
    }

    const isSameEmail = this.database.get(id).email === email
    const hasEmail = this.emailIndex.has(email)
    if (hasEmail && !isSameEmail) {
      throw new Error('Email exists')
    }

    this.database.set(id, { id, name, email })
    this.emailIndex.add(email)
  }

  async delete(id) {
    if (!this.database.has(id)) {
      throw new Error('Customer not exists')
    }

    const customer = this.database.get(id)
    this.database.delete(customer.id)
    this.emailIndex.delete(customer.email)
  }
}

module.exports = {
  MemoryCustomerRepository
}
