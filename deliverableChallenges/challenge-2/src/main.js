import 'dotenv/config'

import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'

import ProductModel from './models/products.model.js'
import MessageModel from './models/messages.model.js'
import UserModel from './models/users.model.js'

import router from './routes/index.routes.js'

import initializePassport from './config/passport.js'

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
    await ProductModel.paginate({}, { limit: 5 })

    socket.emit('products', productsContainer)
  })

  socket.on('newProduct', async (productData) => {
    await ProductModel.create(productData)

    socket.emit('productAddedMessage', "Product added succesfully")
  })

  socket.on('deleteProduct', async (productId) => {
    await ProductModel.findByIdAndDelete(productId)

    socket.emit('productDeletedMessage', "Product deleted successfully")
  })

  socket.on('newUser', async (userData) => {
    await UserModel.create(userData)
  })

  socket.on('loginUser', async (userData) => {
    await UserModel.create(userData)
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
app.use(cookieParser(process.env.JWT_SECRET))
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

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Middlewares Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

// Static Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/static/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.use('/static/realtimecarts', express.static(path.join(__dirname, '/public')))
app.use('/static/chat', express.static(path.join(__dirname, '/public')))
app.use('/static/users', express.static(path.join(__dirname, '/public')))

// API Routes
app.use('/', router)

// Views
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

app.get('/static/users', (req, res) => {
  res.render("users", {
    pathCSS: "users",
    pathJS: "users"
  })
})

app.get('/static/chat', (req, res) => {
  res.render("chat", {
    pathCSS: "chat",
    pathJS: "chat"
  })
})

