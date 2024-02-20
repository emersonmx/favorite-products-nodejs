async function list(request, reply) {
  return {}
}

async function create(request, reply) {
  const id = crypto.randomUUID()

  reply
    .code(201)
    .header('location', encodeURI(`/product-list/${id}`))
    .send({ id })
}

async function show(request, reply) {
  return {}
}

async function destroy(request, reply) {
  return {}
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

    if (!config.adminEmails.includes(request.user.email)) {
      reply.code(401).send()
    }
  })

  const baseBodySchema = S.object()
    .prop('id', S.string().format(S.FORMATS.UUID).required())
  const paramsSchema = S.object()
    .prop('id', S.string().format(S.FORMATS.UUID).required())
  const responseSchema = S.object()
    .prop('id', S.string().format(S.FORMATS.UUID))
    .prop('title', S.string())
    .prop('price', S.number())
    .prop('brand', S.string())
    .prop('image', S.string())
    .prop('reviewScore', S.number())
  const notFoundSchema = S.null().raw({ description: "Product not found" })
  const productExistsSchema = S.null().raw({ description: 'Product already exists' })

  fastify.get('/', {
    schema: {
      tags: ['product-list'],
      response: {
        200: responseSchema,
      }
    }
  }, list)

  fastify.post('/', {
    schema: {
      tags: ['product-list'],
      body: baseBodySchema,
      response: {
        201: responseSchema,
        409: productExistsSchema
      }
    }
  }, create)

  fastify.get('/:id', {
    schema: {
      tags: ['product-list'],
      params: paramsSchema,
      response: {
        200: responseSchema,
        404: notFoundSchema
      }
    }
  }, list)

  fastify.delete('/:id', {
    schema: {
      tags: ['product-list'],
      params: paramsSchema,
      response: {
        200: S.null(),
        404: notFoundSchema
      }
    }
  }, list)
}
