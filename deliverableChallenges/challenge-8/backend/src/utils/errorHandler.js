import Errors from '../services/enums.js'
import logger from './loggers.js'

export default (error, req, res, next) => {
  logger.error(error.cause)

  switch (error.code) {
    case Errors.INVALID_USER_ERROR:
      res.status(400).send({ status: "error", error: error.message })
      break

    case Errors.INVALID_PRODUCT_ERROR:
      res.status(400).send({ status: "error", error: error.message })
      break

    default:
      res.status(500).send({ status: "error", error: "Unhandled error" })
      break
  }
}
