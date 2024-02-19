class CreateCustomer {
  constructor(repository) {
    this.repository = repository
  }

  async execute({ id, name, email }) {
    try {
      await this.repository.create({ id, name, email })
    } catch (error) {
      if (error.message === 'Email exists') {
        throw new Error('E-mail already registered')
      }

      throw error
    }
  }
}

module.exports = CreateCustomer
