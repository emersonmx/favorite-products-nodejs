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

class MemoryCachedProductsApiClient {
  constructor(productsApiClient) {
    this.productsApiClient = productsApiClient
    this.memory = new Map()
  }

  async findById(id) {
    const inMemoryProduct = this.memory.get(id)
    if (inMemoryProduct !== undefined) {
      return inMemoryProduct
    }

    const product = await this.productsApiClient.findById(id)
    if (product === null) {
      return null
    }

    this.memory.set(id, product)
    return product
  }
}

module.exports = {
  AxiosProductsApiClient,
  MemoryCachedProductsApiClient
}
