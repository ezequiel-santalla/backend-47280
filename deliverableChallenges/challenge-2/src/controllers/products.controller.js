import ProductModel from "../models/products.model.js"

export const getProducts = async (req, res) => {
  const { limit, page, filter, sort, category } = req.query

  const pag = page ? page : 1
  const lim = limit ? limit : 10
  const ord = sort == 'asc' ? 1 : -1

  try {

  } catch (error) {
    res.status(500).send({ error: `Error consulting products ${error}` })
  }
}

export const getProduct = async (req, res) => {

}

export const postProduct = async (req, res) => {

}

export const putProduct = async (req, res) => {

}

export const deleteProduct = async (req, res) => {

}