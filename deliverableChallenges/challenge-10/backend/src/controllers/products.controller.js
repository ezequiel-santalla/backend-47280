import ProductModel from '../models/products.model.js'

export const getProducts = async (req, res) => {
  const { limit, page, filter, sort } = req.query

  const pag = page ? page : 1
  const lim = limit ? limit : 10
  const ord = sort == 'asc' ? 1 : -1

  try {
    const products = await ProductModel.paginate({ filter: filter }, { limit: lim, page: pag, sort: { price: ord } })

    if (products) {
      return res.status(200).send(products)
    }

    else {
      res.status(404).send({ error: "Products not found" })
    }

  } catch (error) {
    res.status(500).send({ error: `Error consulting products ${error}` })
  }
}

export const getProduct = async (req, res) => {
  const { pid } = req.params

  try {
    const product = await ProductModel.findById(pid)

    if (product) {
      return res.status(200).send(product)
    }

    else {
      res.status(404).send({ error: "Product not found" })
    }

  } catch (error) {
    res.status(500).send({ error: `Error consulting product ${error}` })
  }
}

export const postProduct = async (req, res) => {
  const { title, description, category, price, stock, code } = req.body

  try {
    const product = await ProductModel.create({ title, description, category, price, stock, code })

    if (product) {
      return res.status(201).send(product)
    }

    else {
      res.status(404).send({ error: "Product not found" })
    }

  } catch (error) {
    if (error.code == 11000) {
      return res.status(400).send({ error: "Duplicated code" })
    }

    else {
      return res.status(500).send({ error: `Error consulting product ${error}` })
    }
  }
}

export const putProduct = async (req, res) => {
  const { pid } = req.params
  const { title, description, category, price, stock, code } = req.body

  try {
    const product = await ProductModel.findByIdAndUpdate(pid, { title, description, category, price, stock, code })

    if (product) {
      return res.status(200).send(product)
    }

    else {
      res.status(404).send({ error: "Product not found" })
    }

  } catch (error) {
    res.status(500).send({ error: `Error updating product ${error}` })
  }
}

export const deleteProduct = async (req, res) => {
  const { pid } = req.params

  try {
    const product = await ProductModel.findByIdAndDelete(pid)

    if (product) {
      return res.status(200).send(product)
    }

    else {
      res.status(404).send({ error: "Product not found" })
    }

  } catch (error) {
    res.status(500).send({ error: `Error deleting product ${error}` })
  }
}