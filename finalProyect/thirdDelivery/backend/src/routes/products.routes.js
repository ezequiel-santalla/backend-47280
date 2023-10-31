import { Router } from 'express'
import {
  getProducts,
  getProduct,
  postProduct,
  putProduct,
  deleteProduct
} from '../controllers/products.controller.js'

const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.get('/', getProduct)
productRouter.post('/', postProduct)
productRouter.put('/', putProduct)
productRouter.delete('/', deleteProduct)

export default productRouter