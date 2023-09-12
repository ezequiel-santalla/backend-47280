import { Router } from 'express'
import CartModel from '../models/carts.model.js'

const cartRouter = Router()

// Route to get all the carts
cartRouter.get('/', async (req, res) => {
  const { limit } = req.query

  try {
    const foundCarts = await CartModel.find().limit(limit)

    res.status(200).send({ result: "OK", message: foundCarts })
  }

  catch (error) {
    res.status(400).send({ error: `Error consulting the carts: ${error}` })
  }
})

// Route to get a cart by its ID
cartRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params

  try {
    const foundCart = await CartModel.findById(cid)

    if (foundCart)
      res.status(200).send({ result: 'OK', message: foundCart })
    else
      res.status(404).send({ result: 'Cart Not Found', message: foundCart })
    }

  catch (error) {
    res.status(400).send({ error: `Error consulting the cart: ${error}` })
  }
})

// Route to create a new cart
cartRouter.post('/', async (req, res) => {
  try {
    const addedCart = await CartModel.create({
      products: []
    })

    res.status(200).send({ result: 'OK', message: addedCart })
  }

  catch (error) {
    res.status(400).send({ error: `Error creating the cart: ${error}` })
  }
})

// Route to add a product to a cart
cartRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const { quantity } = req.body

  try {
    const cart = await CartModel.findById(cid)

    if (!cart) {
      return res.status(404).send({ error: 'Cart not found' })
    }

    const existingProduct = cart.products.find(product => product.id_prod === pid)

    if (existingProduct) {
      existingProduct.quantity += quantity
    } else {
      cart.products.push({ id_prod: pid, quantity: quantity })
    }

    const updatedCart = await cart.save()

    res.status(200).send({ response: "OK", message: updatedCart })
  }

  catch (error) {
    res.status(400).send({ error: `Error adding product to the cart: ${error.message}` })
  }
})

// Route to update a cart
cartRouter.put('/:cid', async (req, res) => {
  const { cid } = req.params
  const { id_prod, quantity } = req.body

  try {
    const updatedCart = await CartModel.findByIdAndUpdate(cid, {
      id_prod, quantity
    })

    if (updatedCart)
      res.status(200).send({ result: 'OK', message: updatedCart })
    else
      res.status(404).send({ result:'Cart Not Found', message: updatedCart })
  }

  catch (error) {
    res.status(400).send ({ error:`Error updating the cart ${error}`})
  }
})

// Route to delete a cart
cartRouter.delete('/:cid', async (req, res) => {
  const { cid } = req.params

  try {
    const deletedCart = await CartModel.findByIdAndDelete(cid)

    if (deletedCart)
      res.status(200).send({ result: "OK", message: deletedCart })
    else
      res.status(404).send({ result: "Cart Not Found", message: deletedCart })
  }

  catch (error) {
    res.status(400).send({ error: `Error deleting the cart: ${error}` })
  }
})

export default cartRouter
