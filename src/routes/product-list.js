const { Errors } = require('../usecases')

function makePageUrl(request, page) {
  const opts = request.routeOptions
  const url = opts.url
  const { limit } = request.query
  if (page === null) {
    return null
  }
  return `${url}?page=${page}&limit=${limit}`
}

async function list(request, reply) {
  const customer = await this.usecases.findCustomerById.execute(request.user.sub)
  const customerId = customer.id
  const { page, limit } = request.query

  const products = await this.usecases.listCustomerFavoriteProducts.execute({
    customerId, page, limit
  })

  this.log.info(`Customer ${customerId} listed favorite products`)

  const currentPage = makePageUrl(request, products.currentPage)
  const nextPage = makePageUrl(request, products.nextPage)
  const previousPage = makePageUrl(request, products.previousPage)
  return {
    currentPage,
    nextPage,
    previousPage,
    products: products.items
  }
}

async function create(request, reply) {
  const customer = await this.usecases.findCustomerById.execute(request.user.sub)
  const customerId = customer.id
  const productId = request.body.id

  let product = await this.usecases.findProductById.execute(customerId, productId)
  if (product !== null) {
    return reply.code(409).send()
  }

  try {
    await this.usecases.favoriteProduct.execute(customerId, productId)
  } catch (error) {
    if (error.message === Errors.NOT_EXISTS) {
      return reply.code(404).send()
    } else {
      throw error
    }
  }

  product = await this.usecases.findProductById.execute(customerId, productId)

  this.log.info(`Customer ${customerId} favorited product ${productId}`)

  reply
    .code(201)
    .header('location', encodeURI(`/product-list/${productId}`))
    .send(product)
}

async function show(request, reply) {
  const customer = await this.usecases.findCustomerById.execute(request.user.sub)
  const customerId = customer.id
  const productId = request.params.id

  const product = await this.usecases.findProductById.execute(customerId, productId)
  if (product === null) {
    return reply.code(404).send()
  }

  this.log.info(`Customer ${customerId} viewed product ${productId}`)

  return product
}

async function destroy(request, reply) {
  const customer = await this.usecases.findCustomerById.execute(request.user.sub)
  const customerId = customer.id
  const productId = request.params.id

  const product = await this.usecases.findProductById.execute(customerId, productId)
  if (product === null) {
    return reply.code(404).send()
  }

  await this.usecases.unfavoriteProduct.execute(customerId, productId)

  this.log.info(`Customer ${customerId} unfavoried product ${productId}`)

  reply.send()
}

module.exports = async (fastify, options) => {
  const S = require('fluent-json-schema')
  const config = require('../config')

  fastify.register(require('@fastify/jwt'), {
    secret: config.customerJwtSecret
  })

  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }

    const customer = await fastify.usecases.findCustomerById.execute(request.user.sub)
    if (customer === null) {
      reply.code(401).send()
    }
  })

  const baseSchema = {
    tags: ['product-list'],
    security: [{ customerAuth: [] }],
  }
  const baseBodySchema = S.object()
    .prop('id', S.string().format(S.FORMATS.UUID).required())
  const paramsSchema = S.object()
    .prop('id', S.string().format(S.FORMATS.UUID).required())
  const responseSchema = S.object()
    .prop('id', S.string().format(S.FORMATS.UUID))
    .prop('title', S.string())
    .prop('price', S.number())
    .prop('image', S.string())
    .prop('reviewScore', S.anyOf([S.number(), S.null()]))
  const queryListSchema = S.object()
    .prop('page', S.number().minimum(1).default(1).required())
    .prop(
      'limit',
      S.number()
        .minimum(config.minPageLimit)
        .maximum(config.maxPageLimit)
        .default(config.defaultPageLimit)
        .required()
    )
  const responseListSchema = S.object()
    .prop('currentPage', S.string())
    .prop('nextPage', S.anyOf([S.string(), S.null()]))
    .prop('previousPage', S.anyOf([S.string(), S.null()]))
    .prop('products', S.array().items(responseSchema))

  const notFoundSchema = S.null().raw({ description: "Product not found" })
  const productExistsSchema = S.null().raw({ description: 'Product already exists' })

  fastify.get('/:id', {
    schema: {
      ...baseSchema,
      params: paramsSchema,
      response: {
        200: responseSchema,
        404: notFoundSchema
      }
    }
  }, show)

  fastify.get('/', {
    schema: {
      ...baseSchema,
      query: queryListSchema,
      response: {
        200: responseListSchema,
      }
    }
  }, list)

  fastify.post('/', {
    schema: {
      ...baseSchema,
      body: baseBodySchema,
      response: {
        201: responseSchema,
        404: notFoundSchema,
        409: productExistsSchema
      }
    }
  }, create)

  fastify.delete('/:id', {
    schema: {
      ...baseSchema,
      params: paramsSchema,
      response: {
        200: S.null(),
        404: notFoundSchema
      }
    }
  }, destroy)
}
