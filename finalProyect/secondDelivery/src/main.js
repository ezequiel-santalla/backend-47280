import 'dotenv/config'

import express from 'express'
import mongoose from 'mongoose'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'

import ProductModel from './models/products.model.js'
import MessageModel from './models/messages.model.js'

import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import messageRouter from './routes/messages.routes.js'

const app = express()
const PORT = 8080

// Server
const server = app.listen(PORT, () => {
  console.log(`Server on PORT: ${PORT}
http://localhost:${PORT}`)
})

const io = new Server(server)

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URL)
    .then (async () => {
      console.log('BDD connected')
    })
    .catch((error) => console.log("Error connecting with MongoDB ATLAS: ", error))

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Connection with Socket.io")

  socket.on('load', async () => {
		const products = await ProductModel.paginate({}, { limit: 5 })

		socket.emit('products', products)
	})

  socket.on('newProduct', async (productData) => {
    await ProductModel.create(productData)

    socket.emit('productAddedMessage', "Product added succesfully")
  })

  socket.on('deleteProduct', async (productId) => {
    await ProductModel.findByIdAndDelete(productId)

    socket.emit('productDeletedMessage', "Product deleted successfully")
  })

  socket.on('message', async info => {
		const { message } = info

		await MessageModel.create({
			message
		})

    const messages = await MessageModel.find()

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