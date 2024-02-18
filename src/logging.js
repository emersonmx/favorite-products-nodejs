const winston = require('winston');

function getLogger(name) {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: name },
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    ],
  });
  return logger
}

module.exports = {
  getLogger
}