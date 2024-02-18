const express = require('express')

const router = express.Router()

router.use('/customers', require('./customers'))

module.exports = router
