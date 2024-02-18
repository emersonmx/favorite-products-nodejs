const express = require('express')

const router = express.Router()

const customers = new Map()

router.post('/', async (req, res) => {
  const id = crypto.randomUUID()
  const { name, email } = req.body
  customers.set(id, { id, name, email })
  res.status(201).location(`http://localhost:3000/customers/${id}`).end()
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

  const { name, email } = req.body
  customers.set(id, { id, name, email })
  res.status(200).end()
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  if (!customers.has(id)) {
    return res.status(404).end()
  }

  customers.delete(id)
  res.status(200).end()
})

module.exports = router
