import express from 'express'
import { router as customers } from './customers.js'

export const router = express.Router()

router.use('/customers', customers)
