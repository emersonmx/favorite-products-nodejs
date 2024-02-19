const S = require('fluent-json-schema')

const customers = new Map()

module.exports = async (fastify, options) => {
  const baseBodySchema = S.object()
    .prop('name', S.string().minLength(1).required())
    .prop('email', S.string().format(S.FORMATS.EMAIL).required())
  const paramsSchema = S.object()
    .prop('id', S.string().format('uuid').required())
  const responseSchema = S.object()
    .prop('id', S.string())
    .prop('name', S.string())
    .prop('email', S.string())

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
    const id = crypto.randomUUID()
    const { name, email } = request.body

    customers.set(id, { id, name, email })

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
    customers.set(id, { id, name, email })

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

    customers.delete(id)

    reply.send()
  })
}
