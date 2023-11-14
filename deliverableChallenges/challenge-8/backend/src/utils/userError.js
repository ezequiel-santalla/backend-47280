import Errors from '../services/errors/enums.js';

const UserErrorMiddleware = (error, req, res, next) => {
  switch (error.code) {
    case Errors.INVALID_USER_ERROR:
      res.send({ status: "error", error: error.name })
      break

    case Errors.INVALID_PRODUCT_ERROR:
      res.send({ status: "error", error: error.name })
      break

    default:
      res.send({ status: "error", error: "Unhandled error" })
      break
    }
}

export default UserErrorMiddleware