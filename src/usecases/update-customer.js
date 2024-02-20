class UpdateCustomer {
  constructor(customersData) {
    this.customersData = customersData
  }

  async execute(id, { name, email }) {
    await this.customersData.update(id, { name, email })
  }
}

module.exports = UpdateCustomer
