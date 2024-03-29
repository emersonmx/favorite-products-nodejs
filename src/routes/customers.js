const { Errors } = require('../usecases')

async function create(request, reply) {
  const { name, email } = request.body

  const customer = await this.usecases.findCustomerByEmail.execute(email)
  if (customer !== null) {
    return reply.code(409).send()
  }

  const id = crypto.randomUUID()
  await this.usecases.createCustomer.execute({ id, name, email })

  this.log.info(`Customer ${id} was created by ${request.user.name}`)

  reply
    .code(201)
    .header('location', encodeURI(`/customers/${id}`))
    .send({ id, name, email })
}

async function show(request, reply) {
  const { id } = request.params
  const customer = await this.usecases.findCustomerById.execute(id)
  if (customer === null) {
    return reply.code(404).send()
  }

  this.log.info(`${request.user.name} viewed user ${id}`)

  return customer
}

async function update(request, reply) {
  const { id } = request.params
  const customer = await this.usecases.findCustomerById.execute(id)
  if (customer === null) {
    return reply.code(404).send()
  }

  const { name, email } = request.body
  try {
    await this.usecases.updateCustomer.execute(id, { name, email })
  } catch (error) {
    if (error.message === Errors.INTEGRITY_ERROR) {
      return reply.code(409).send()
    } else {
      throw error
    }
  }

  this.log.info(`Customer ${id} was updated by ${request.user.name}`)

  return { id, name, email }
}

async function destroy(request, reply) {
  const { id } = request.params
  const customer = await this.usecases.findCustomerById.execute(id)
  if (customer === null) {
    return reply.code(404).send()
  }

  await this.usecases.deleteCustomer.execute(id)

  this.log.info(`Customer ${id} was deleted by ${request.user.name}`)

  reply.send()
}

module.exports = async (fastify, options) => {
  const S = require('fluent-json-schema')
  const config = require('../config')

  fastify.register(require('@fastify/jwt'), {
    secret: config.adminJwtSecret
  })

  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }

    if (!config.adminEmails.includes(request.user.sub)) {
      reply.code(401).send()
    }
  })

  const baseSchema = {
    tags: ['customers'],
    security: [{ adminAuth: [] }],
  }
  const baseBodySchema = S.object()
    .prop('name', S.string().minLength(1).required())
    .prop('email', S.string().format(S.FORMATS.EMAIL).required())
  const paramsSchema = S.object()
    .prop('id', S.string().format(S.FORMATS.UUID).required())
  const responseSchema = S.object()
    .prop('id', S.string().format(S.FORMATS.UUID))
    .prop('name', S.string())
    .prop('email', S.string().format(S.FORMATS.EMAIL))
  const notFoundSchema = S.null().raw({ description: "Customer not found" })
  const emailExistsSchema = S.null().raw({ description: 'Email already exists' })

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

  fastify.post('/', {
    schema: {
      ...baseSchema,
      body: baseBodySchema,
      response: {
        201: responseSchema,
        409: emailExistsSchema
      }
    }
  }, create)

  fastify.put('/:id', {
    schema: {
      ...baseSchema,
      params: paramsSchema,
      body: baseBodySchema,
      response: {
        200: responseSchema,
        404: notFoundSchema,
        409: emailExistsSchema
      }
    }
  }, update)

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
