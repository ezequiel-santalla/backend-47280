// Class "ProductManager"
class ProductManager {
  constructor() {
    this.products = []
  }

  // Method of "ProductManager" class that prints in the console the current list of products stored in the "this.products" array
  getProducts() {
    console.log(this.products)
  }

  // Method of "ProductManager" class that allows to add a new product to the list if the product code is unique
  addProduct(title, description, price, thumbnail, code, stock) {
    if (this.products.some((product) => product.code === code)) {
      console.error("Product code is already uploaded")
    } else {
      this.products.push({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        id: this.products.length + 1,
      })
    }
  }

  // Method of "ProductManager" that allows to get a product from the list based on its ID if the ID is found
  getProductById(id) {
    const product = this.products.find((product) => product.id === id)
    if (product) {
      console.log(product)
    } else {
      console.error("Product not found")
    }
  }
}

// Instance of the "ProductManager" class
const productManager = new ProductManager()

// Prints an empty array because no products have been added yet
productManager.getProducts()

// Adds a new product to the list, as long as the code is unique
productManager.addProduct("test product", "This is a test product", 200, "No image", "abc123", 25)

// Prints the updated list of products
productManager.getProducts()

// Adds a new product with the same code as the previously product, it displays an error message in the console because the code is not unique
productManager.addProduct("test product", "This is a test product", 200, "No image", "abc123", 25)

// Tries to get a product with ID 23, but no product with that ID exists, so it returns an error
productManager.getProductById(23)

// Tries to get the product with ID 1, which is the first product added. Displays the details of this product in the console
productManager.getProductById(1)