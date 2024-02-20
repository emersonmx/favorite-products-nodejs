class FindCustomerByEmail {
  constructor(customersData) {
    this.customersData = customersData
  }

  async execute(email) {
    return await this.customersData.findByEmail(email)
  }
}

module.exports = FindCustomerByEmail
