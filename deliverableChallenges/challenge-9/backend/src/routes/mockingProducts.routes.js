import { Router } from 'express'
import generateRandomProducts from '../utils/mockingProducts.js'
import { passportError, authorization } from '../utils/messageErrors.js'
import loggers from '../utils/loggers.js'

const mockingProductsRouter = Router()

mockingProductsRouter.get('/', passportError('jwt'), authorization(['admin']), (req, res) => {
  loggers.http('GET /mockingProducts')

  const products = generateRandomProducts(100)
  res.json(products)
})

export default mockingProductsRouter