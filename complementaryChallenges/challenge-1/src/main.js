import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import { ProductManager } from './controllers/productManager.js'
import path from 'path'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import userRouter from './routes/users.routes.js'
import messageRouter from './routes/messages.routes.js'

const app = express()
const PORT = 8080
const productManager = new ProductManager('src/models/products.json')

// Server
mongoose.connect('mongodb+srv://ezequielsantalla99:tenis1999@f1-db.xvrpfy5.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log("DB connected"))
  .catch((error) => console.log("Error connecting to MongDB Atlas: ", error))

const server = app.listen(PORT, () => {
  console.log(`Server on PORT: ${PORT}
http://localhost:${PORT}`)
})

const io = new Server(server)

// Config
const imageStorageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/img')
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`)
  }
})

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

const imageUpload = multer({ storage: imageStorageConfig })
const messages = []

// Socket.io conection
io.on("connection", (socket) => {
  console.log("Connection with Socket.io")

  socket.on('load', async () => {
		const products = await productManager.getProducts()

		socket.emit('products', products)
	})

  socket.on('newProduct', async (productData) => {
    await productManager.addProduct(productData)

    socket.emit('productAddedMessage', "Product added succesfully")
  })

  socket.on('deleteProduct', async (productId) => {
    await productManager.deleteProduct(productId)

    socket.emit('productDeletedMessage', "Product deleted successfully")
  })

  socket.on('message', info => {
    console.log(info)
    messages.push(info)

    socket.emit('messages', messages)
  })
})

// Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/static/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.use('/static/realtimecarts', express.static(path.join(__dirname, '/public')))
app.use('/static/chat', express.static(path.join(__dirname, '/public')))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/users', userRouter)
app.use('/api/messages', messageRouter)

// Handlebars
app.get('/static', (req, res) => {
  res.render("home", {
    pathCSS: "home",
    pathJS: "home"
  })
})

app.get('/static/realtimeproducts', (req, res) => {
  res.render("realTimeProducts", {
    pathCSS: "realTimeProducts",
    pathJS: "realTimeProducts"
  })
})

app.get('/static/realtimecarts', (req, res) => {
  res.render("realTimeCarts", {
    pathCSS: "realTimeCarts",
    pathJS: "realTimeCarts"
  })
})

app.get('/static/chat', (req, res) => {
  res.render("chat", {
    pathCSS: "chat",
    pathJS: "chat"
  })
})

app.post('/upload', imageUpload.single('product'), (req, res) => {
  res.status(200).send("Upload Image")
})