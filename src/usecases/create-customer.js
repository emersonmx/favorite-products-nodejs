class CreateCustomer {
  constructor(customersData) {
    this.customersData = customersData
  }

  async execute({ id, name, email }) {
    await this.customersData.create({ id, name, email })
  }
}

module.exports = CreateCustomer
