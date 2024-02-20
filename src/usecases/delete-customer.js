class DeleteCustomer {
  constructor(customersData) {
    this.customersData = customersData
  }

  async execute(id) {
    await this.customersData.delete(id)
  }
}

module.exports = DeleteCustomer
