const { Errors } = require("./errors")

class CreateCustomer {
  constructor(customersData) {
    this.customersData = customersData
  }

  async execute({ id, name, email }) {
    try {
      await this.customersData.create({ id, name, email })
    } catch (error) {
      if (error.message === Errors.INTEGRITY_ERROR) {
        throw new Error('E-mail already registered')
      }

      throw error
    }
  }
}

module.exports = CreateCustomer
