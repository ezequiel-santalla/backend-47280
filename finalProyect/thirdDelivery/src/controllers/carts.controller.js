import CartModel from '../models/carts.model.js'

export const getCarts = async (req, res) => {
  const { limit } = req.query

  try {
    const cart = await CartModel.find().limit(limit)

    res.status(200).send({ result: "OK", message: cart })
  }

  catch (error) {
    res.status(400).send({ error: `Error consulting the carts: ${error}` })
  }
}

export const postProductToCart = async (req, res) => {
  const { cid, pid } = req.params
  const { quantity } = req.body

  try {
    const cart = await CartModel.findById(cid)

    if (cart) {
      const product = foundCart.products.find(product => product.id_prod.equals(pid))

      if (product) {
        product.quantity += quantity
      } else {
        cart.products.push({ id_prod: pid, quantity: quantity })
      }

      const cart = await cart.save()

      res.status(200).send({ result: "OK", message: "Product added to cart", cart: cart  })
    } else {
      res.status(404).send({ error: 'Cart not found' })
    }

  } catch (error) {
    res.status(400).send({ error: `Error adding/updating a product in the cart: ${error}` })
  }
}

export const updateProductInCart = async (req, res) => {
  const { cid } = req.params
  const { product } = req.body

  try {
    const cart = await CartModel.findByIdAndUpdate(
      cid,
      { product },
      { new: true }
    )

    if (cart) {
      res.status(200).send({ result: 'OK', message: 'Cart updated', cart: cart })
    } else {
      res.status(404).send({ error: 'Cart Not Found' })
    }

  } catch (error) {
    res.status(400).send({ error: `Error updating the cart: ${error}` })
  }
}

export const updateProductInCartByQuantity = async (req, res) => {
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
}

export const deleteProductFromCart = async (req, res) => {
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
}

export const deleteAllProductsFromCart = async (req, res) => {
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
}