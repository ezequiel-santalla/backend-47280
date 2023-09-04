const socket = io()

const addProductForm = document.getElementById('createProduct')
const deleteProductForm = document.getElementById('deleteProduct')

socket.on('productAddedMessage', (message) => {
  Swal.fire(message)
})

socket.on('productDeletedMessage', (message) => {
  Swal.fire(message)
})

addProductForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(event.target)
  const productData = Object.fromEntries(formData)

  socket.emit('newProduct', productData)

  event.target.reset()
})

deleteProductForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const productId = event.target.productId.value

  socket.emit('deleteProduct', productId)

  event.target.reset()
})



