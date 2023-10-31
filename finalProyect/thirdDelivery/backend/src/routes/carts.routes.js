import { Router } from 'express'
import {
  getCarts,
  postProductToCart,
  updateProductInCart,
  updateProductInCartByQuantity,
  deleteProductFromCart,
  deleteAllProductsFromCart
} from '../controllers/carts.controller.js'

const cartRouter = Router()

cartRouter.get('/', getCarts)
cartRouter.post('/', postProductToCart)
cartRouter.put('/', updateProductInCart)
cartRouter.put('/', updateProductInCartByQuantity)
cartRouter.delete('/', deleteProductFromCart)
cartRouter.delete('/', deleteAllProductsFromCart)

export default cartRouter

