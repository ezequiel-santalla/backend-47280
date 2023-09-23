const socket = io()

const addUserForm = document.getElementById('createUser')

addUserForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(event.target)
  const userData = Object.fromEntries(formData)

  socket.emit('newUser', userData)

  event.target.reset()

  window.location.href = '/static/login'
})