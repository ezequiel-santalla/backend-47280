import 'dotenv/config'

import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'

import ProductModel from './models/products.model.js'
import MessageModel from './models/messages.model.js'

import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import userRouter from './routes/users.routes.js'
import sessionRouter from './routes/sessions.routes.js'
import messageRouter from './routes/messages.routes.js'

import auth from './auth.js'

const app = express()
const PORT = 8080

// Server
const server = app.listen(PORT, () => {
  console.log(`Server on PORT: ${PORT}
http://localhost:${PORT}`)
})

const io = new Server(server)

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URL)
  .then(async () => { console.log('Database connected') })
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

// Middlewares App
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SIGNED_COOKIES))
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 5
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

// Middlewares Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

// Static Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/static/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.use('/static/realtimecarts', express.static(path.join(__dirname, '/public')))
app.use('/static/chat', express.static(path.join(__dirname, '/public')))

// API Routes
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/messages', messageRouter)
app.use('/api/users', userRouter)
app.use('/api/sessions', sessionRouter)

// Handlebars Views
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

// Sessions Views
app.get('/session', (req, res) => {
  res.send("Welcome to the webpage!")
})

app.get('/login', (req, res) => {
  const { email, password } = req.body

  req.session.email = email
  req.session.password = password

  res.send("User Logged In")
})

app.get('/admin', auth, (req, res) => {
  res.send("You are Admin!")
})

app.get('/logout', (req, res) => {
  res.send("User Logged Out")
})

