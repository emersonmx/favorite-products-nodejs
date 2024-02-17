import express from 'express'

export const router = express.Router()

router.post('/', async (req, res) => {
  res.status(201).location('http://localhost:3000/customers/1').send()
})
