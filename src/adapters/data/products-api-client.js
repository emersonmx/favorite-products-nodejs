class AxiosProductsApiClient {
  constructor(httpClient) {
    this.httpClient = httpClient
  }

  async findById(id) {
    const product = await this.httpClient.get(`/${id}/`)
    if (product.status !== 200) {
      return null
    }
    return product.data
  }
}

module.exports = {
  AxiosProductsApiClient
}
