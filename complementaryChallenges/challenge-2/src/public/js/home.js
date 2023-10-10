const socket = io()

const productsContainer = document.getElementById('productsContainer')

socket.on('products', (products) => {
  productsContainer.innerHTML = ''

  products.forEach((product) => {
    const productCard =
      `<div class="product">
        <h2>${product.title}</h2>
        <p>Description: ${product.description}</p>
        <p>Price: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Code: ${product.code}</p>
        <p>Status: ${product.status}</p>
      </div>`

    productsContainer.innerHTML += productCard
  })
})





