const S = require('fluent-json-schema')
const config = require('../config')

const customers = new Map()
const emailIndex = new Set()

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
    if (!customers.has(id)) {
      return reply.code(404).send()
    }

    return customers.get(id)
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

    if (emailIndex.has(email)) {
      return reply.code(409).send()
    }

    const id = crypto.randomUUID()
    customers.set(id, { id, name, email })
    emailIndex.add(email)

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
    if (!customers.has(id)) {
      return reply.code(404).send()
    }

    const { name, email } = request.body
    const hasEmail = emailIndex.has(email)
    const isSameEmail = customers.get(id).email === email
    if (hasEmail && !isSameEmail) {
      return reply.code(409).send()
    }

    customers.set(id, { id, name, email })
    emailIndex.add(email)

    return customers.get(id)
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
    if (!customers.has(id)) {
      return reply.code(404).send()
    }

    const { email } = customers.get(id)
    customers.delete(id)
    emailIndex.delete(email)

    reply.send()
  })
}
