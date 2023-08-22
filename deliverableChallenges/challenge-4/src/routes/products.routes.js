import { Router } from 'express'
import { ProductManager } from '../controllers/productManager.js'

const productManager = new ProductManager('src/models/products.json')

const routerProd = Router()

// Route to get all the products
routerProd.get('/', async (req, res) => {
  const { limit } = req.query

  const allProducts = await productManager.getProducts()
  const limitedProducts = allProducts.slice(0, limit)

  res.status(200).send(limitedProducts)
})

// Route to get a specif product by ID
routerProd.get('/:pid', async (req, res) => {
  const { pid } = req.params
  const product = await productManager.getProductById(pid)

  product
  ? res.status(200).json(product)
  : res.status(404).send("Product does not exist")
})

// Route to add a new product
routerProd.post('/', async (req, res) => {
  const response = await productManager.addProduct(req.body)

  return res.status(response.status ? 200 : 400).send(response.message)
})


// Route to update a product
routerProd.put('/:pid', async (req, res) => {
  const isProductUpdated = productManager.updateProduct(req.params.pid, req.body)

  const response = isProductUpdated
    ? res.status(200).send("Product updated successfully")
    : res.status(404).send("Product not found")

  return response
})

// Route to delete a product
routerProd.delete('/:pid', async (req, res) => {
  const isProductDeleted = productManager.deleteProduct(req.params.pid)

  const response = isProductDeleted
    ? res.status(200).send("Product deleted successfully")
    : res.status(404).send("Product not found")

  return response
})

export default routerProd