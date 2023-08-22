import { Router } from 'express'
import CartManager from '../controllers/cartManager.js'

const routerCart = Router()
const cartManager = new CartManager('src/models/carts.json')

// Route to create a new cart
routerCart.post('/', async (req, res) => {
  const newCart = await cartManager.createCart()

  const response = newCart
    ? res.status(200).send("Cart added successfully")
    : res.status(400).send("Cart already exists")

  return response
})

// Route to add a product to a cart
routerCart.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid
  const productId = req.params.pid
  const { quantity } = req.body

  const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity)
  res.json(updatedCart.products)
})

// Route to get the products of a specific cart
routerCart.get('/:cid', async (req, res) => {
  const cartId = req.params.cid
  const cart = await cartManager.getCart(cartId)

  if (!cart) {
    res.status(404).send("Cart not found")

    return
  }

  res.send(cart.products)
})


export default routerCart
