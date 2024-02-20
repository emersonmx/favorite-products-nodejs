const S = require('fluent-json-schema')
const config = require('../config')
const { Errors } = require('../adapters/data')

module.exports = async (fastify, options) => {
  fastify.register(require('@fastify/jwt'), {
    secret: config.adminJwtSecret
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
    .prop('name', S.string().minLength(1).required())
    .prop('email', S.string().format(S.FORMATS.EMAIL).required())
  const paramsSchema = S.object()
    .prop('id', S.string().format(S.FORMATS.UUID).required())
  const responseSchema = S.object()
    .prop('id', S.string().format(S.FORMATS.UUID))
    .prop('name', S.string())
    .prop('email', S.string().format(S.FORMATS.EMAIL))

  fastify.get('/:id', {
    schema: {
      params: paramsSchema,
      response: {
        200: responseSchema
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    const customer = await fastify.customersData.findById(id)
    if (customer === null) {
      return reply.code(404).send()
    }

    return customer
  })

  fastify.post('/', {
    schema: {
      body: baseBodySchema,
      response: {
        201: responseSchema
      }
    }
  }, async (request, reply) => {
    const { name, email } = request.body

    const customer = await fastify.customersData.findByEmail(email)
    if (customer !== null) {
      return reply.code(409).send()
    }

    const id = crypto.randomUUID()
    fastify.customersData.create({ id, name, email })

    reply
      .code(201)
      .header('location', encodeURI(`/customers/${id}`))
      .send({ id, name, email })
  })

  fastify.put('/:id', {
    schema: {
      params: paramsSchema,
      body: baseBodySchema,
      response: {
        200: responseSchema
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    const customer = await fastify.customersData.findById(id)
    if (customer === null) {
      return reply.code(404).send()
    }

    const { name, email } = request.body
    try {
      await fastify.customersData.update(id, { name, email })
    } catch (error) {
      if (error.message === Errors.INTEGRITY_ERROR) {
        return reply.code(409).send()
      } else {
        throw error
      }
    }

    return { id, name, email }
  })

  fastify.delete('/:id', {
    schema: {
      params: paramsSchema,
      response: {
        200: responseSchema
      }
    }
  }, async (request, reply) => {
    const { id } = request.params

    const customer = await fastify.customersData.findById(id)
    if (customer === null) {
      return reply.code(404).send()
    }

    await fastify.customersData.delete(id)

    reply.send()
  })
}
