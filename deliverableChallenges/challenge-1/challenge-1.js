// Class "ProductManager"
class ProductManager {
  constructor() {
    this.products = []
  }

  // Method of "ProductManager" class that prints in the console the current list of products stored in the "this.products" array
  getProducts() {
    return this.products
  }

  // Method of "ProductManager" that allows to get a product from the list based on its ID if the ID is found
  getProductById(id) {
    const product = this.products.find((prod) => prod.id === id)

    if (product) {
      return product
    }
    return "Product not found"
  }

  // Method of "ProductManager" class that allows to add a new product to the list if the product code is unique
  addProduct(product) {
    if (this.products.some((prod) => prod.code === product.code)) {
      return "Product code is already uploaded"
    }

    if (product.title != "" || product.description != "" || product.price > 0 || product.thumbnail != "" || product.code != "" || product.stock >= 0) {
      this.products.push(product)
    } else {
      return "Some of the fields are wrong, please try again"
    }
  }
}

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
      this.title = title
      this.description = description
      this.price = price
      this.thumbnail = thumbnail
      this.code = code
      this.stock = stock
      this.id = Product.increaseID()
  }
  static increaseID() {
    if (this.idIncrement) {
      this.idIncrement++

    } else {
      this.idIncrement = 1
    }
    return this.idIncrement
  }
}

const product1 = new Product("Rice", "White", 1000, "No img", "123", 20)
const product2 = new Product("Beans", "Brown", 1200, "No img", "123", 20)

const productManager = new ProductManager()

productManager.addProduct(product1)
productManager.addProduct(product2)

console.log(productManager.getProducts())
console.log(productManager.addProduct())