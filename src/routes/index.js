const express = require('express')

const router = express.Router()

router.use('/customers', require('./customers.js'))

module.exports = router
