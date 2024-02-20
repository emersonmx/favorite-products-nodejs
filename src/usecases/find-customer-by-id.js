class FindCustomerById {
  constructor(customersData) {
    this.customersData = customersData
  }

  async execute(id) {
    return await this.customersData.findById(id)
  }
}

module.exports = FindCustomerById
