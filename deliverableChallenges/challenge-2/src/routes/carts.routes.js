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
    const newCart = await CartModel.create({
      products: []
    })

    res.status(200).send({ result: 'OK', message: newCart })
  }

  catch (error) {
    res.status(400).send({ error: `Error creating the cart: ${error}` })
  }
})

// Route to add a product into a cart
cartRouter.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const { quantity } = req.body

  try {
    const foundCart = await CartModel.findById(cid)

    if (foundCart) {
      const existingProduct = foundCart.products.find(product => product.id_prod.equals(pid))

      if (existingProduct) {
        existingProduct.quantity += quantity
      } else {
        foundCart.products.push({ id_prod: pid, quantity: quantity })
      }

      const updatedCart = await foundCart.save()

      res.status(200).send({ result: 'OK', message: 'Product added to cart', cart: updatedCart })
    } else {
      res.status(404).send({ error: 'Cart not found' })
    }
  }

  catch (error) {
    res.status(400).send({ error: `Error adding/updating a product in the cart: ${error}` })
  }
})

// Route to update a cart
cartRouter.put('/:cid', async (req, res) => {
  const { cid } = req.params
  const { products } = req.body

  try {
    const updatedCart = await CartModel.findByIdAndUpdate(cid,
      { products },
      { new: true }
    )

    if (updatedCart) {
      res.status(200).send({ result: 'OK', message: 'Cart updated', cart: updatedCart })
    } else {
      res.status(404).send({ error: 'Cart Not Found' })
    }
  }

  catch (error) {
    res.status(400).send({ error: `Error updating the cart: ${error}` })
  }
})

// Route to update a product from a cart just by quantity
cartRouter.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const { quantity } = req.body

  try {
    const foundCart = await CartModel.findById(cid)

    if (foundCart) {
      const productIndex = foundCart.products.findIndex(product => product.id_prod._id.equals(pid))

      if (productIndex !== -1) {
        foundCart.products[productIndex].quantity = quantity

        const updatedCart = await foundCart.save()

        res.status(200).send({ result: 'OK', message: 'Cart quantity of the product updated', cart: updatedCart })
      } else {
        res.status(404).send({ error: 'Product Not Found on cart' })
      }
    } else {
      res.status(404).send({ error: 'Cart Not Found' })
    }
  }

  catch (error) {
    res.status(400).send({ error: `Error updating the product quantity on the cart: ${error}` })
  }
})

// Route to delete a product from a cart
cartRouter.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params

  try {
    const foundCart = await CartModel.findById(cid)

    if (foundCart) {
      const productIndex = foundCart.products.findIndex(product => product.id_prod._id.equals(pid))

      if (productIndex !== -1) {
        foundCart.products.splice(productIndex, 1)

        const updatedCart = await foundCart.save()

        res.status(200).send({ result: 'OK', message: 'Product deleted from the cart', cart: updatedCart })
      } else {
        res.status(404).send({ error: 'Product Not Found in Cart' })
      }
    } else {
      res.status(404).send({ error: 'Cart Not Found' })
    }
  }

  catch (error) {
    res.status(400).send({ error: `Error deleting the product from the cart: ${error}` })
  }
})

// Route to delete all the products from a cart
cartRouter.delete('/:cid', async (req, res) => {
  const { cid } = req.params

  try {
    const foundCart = await CartModel.findById(cid)

    if (foundCart) {
      foundCart.products = []

      const updatedCart = await foundCart.save()

      res.status(200).send({ result: 'OK', message: 'All the products were deleted from the cart', cart: updatedCart })
    } else {
      res.status(404).send({ error: 'Cart Not Found' })
    }
  }

  catch (error) {
    res.status(400).send({ error: `Error deleting all the products from the cart: ${error}` })
  }
})

export default cartRouter
