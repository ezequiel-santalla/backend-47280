import 'dotenv/config'

import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import { __dirname } from './path.js'

import router from './routes/index.routes.js'

import initializePassport from './config/passport.js'
import config from './config/config.js'

const app = express()
const PORT = 8080

// Server
app.listen(PORT, () => {
  console.log(`Server on PORT: ${PORT}
http://localhost:${PORT}`)
})

// MongoDB Atlas connection
mongoose.connect(config.mongoUrl)
  .then(async () => { console.log('Database connected') })
  .catch((error) => console.log("Error connecting with MongoDB ATLAS: ", error))

// Middlewares App
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(config.jwtSecret))
app.use(session({
  store: MongoStore.create({
    mongoUrl: config.mongoUrl,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 5
  }),
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// API Routes
app.use('/', router)

