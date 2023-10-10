import ProductModel from "../models/products.model.js"

class ProductManager {
  async getProducts(query = {} ) {
    const { limit = 10, page = 1, sort, category, stock } = query

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sort === 'desc' ? { price: -1 } : sort === 'asc' ? { price: 1 } : {},
      lean: true
    }

    const queryOptions = {}

    if (category) {
      queryOptions.category = category
    }

    if (stock) {
      queryOptions.stock = stock
    }

    const paginatedProducts = await ProductModel.paginate(queryOptions, options)

    return paginatedProducts
  }
}

export default new ProductManager()