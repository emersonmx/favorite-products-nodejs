const express = require('express')
const z = require('zod')

const logger = require('../factories').makeLogger()
const router = express.Router()
const customers = new Map()

const Customer = z.object({
  name: z.string().min(1),
  email: z.string().email()
})

router.post('/', async (req, res) => {
  const validCustomer = Customer.safeParse(req.body)
  if (!validCustomer.success) {
    return res.status(400).end()
  }

  const id = crypto.randomUUID()
  const { name, email } = validCustomer.data
  customers.set(id, { id, name, email })

  logger.info(`Customer ${id} was created`)

  res.status(201).location(`/customers/${id}`).end()
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  if (!customers.has(id)) {
    return res.status(404).end()
  }

  res.status(200).send(customers.get(id))
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  if (!customers.has(id)) {
    return res.status(404).end()
  }

  const validCustomer = Customer.safeParse(req.body)
  if (!validCustomer.success) {
    return res.status(400).end()
  }

  const { name, email } = validCustomer.data
  customers.set(id, { id, name, email })

  logger.info(`Customer ${id} was updated`)

  res.status(200).end()
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  if (!customers.has(id)) {
    return res.status(404).end()
  }

  customers.delete(id)

  logger.info(`Customer ${id} was deleted`)

  res.status(200).end()
})

module.exports = router
