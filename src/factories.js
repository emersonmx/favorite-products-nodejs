const logging = require('./logging')

let logger

function makeLogger() {
  if (logger === undefined) {
    logger = logging.getLogger('favorite-products')
  }
  return logger
}

module.exports = {
  makeLogger
}
