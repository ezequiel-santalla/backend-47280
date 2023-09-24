import { Router } from 'express'
import UserModel from '../models/users.model.js'
import productsController from '../controllers/products.controller.js'

const sessionRouter = Router()



sessionRouter.get('/login', async (req, res) => {
  if (req.session.login) {
      res.redirect('/')
  } else {
      res.render('login')
  }
})


sessionRouter.get('/register', async (req, res) => {
  if (req.session.user) {
      res.redirect('/')
  } else {
      res.render('users')
  }
})


sessionRouter.post('/register', async (req, res) => {
  const { email, password, first_name, last_name, age } = req.body

  const existingUser = await UserModel.findOne({ email })
  if (existingUser) {
      return res.render('register', { error: 'El correo electrónico ya está registrado' })
  }

  const user = new UserModel({ email, password, first_name, last_name, age })
  await user.save()

  delete user.password
  req.session.user = userDetails;
  res.redirect('/products');
})
// Route to create a session
sessionRouter.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    if (req.session.login) {
      res.status(200).send({ result: 'Login already exists' })
    }

    const loggedInUser = await UserModel.findOne({ email: email })

    if (loggedInUser) {
      if (loggedInUser.password == password) {
        delete loggedInUser.password
        req.session.login = true
        req.session.user = loggedInUser

        res.redirect('/products')
      } else {
        res.status(401).send({ result: 'User Unauthorized', message: loggedInUser })
      }
    } else {
      res.status(404).send({ result: 'User Not Found', message: loggedInUser })
    }
  }

  catch (error) {
    res.status(400).send({ error: `Error Logging: ${error}` })
  }
})

// Route to destroy a session
sessionRouter.get('/logout', (req, res) => {
  if (req.session.login) {
    req.session.destroy(error => {
      if (error) {
        res.status(500).send({ error: 'Error logging out' })
      } else {
        res.redirect('/')
      }
    })
  } else {
    res.status(401).send({ error: 'There is no active session' })
  }
})

// Handlebars Views
sessionRouter.get('/', async (req, res) => {
  res.render("home", {
    pathCSS: "home",
    pathJS: "home",
    user: req.session.user
  })
})

// Handlebars Views
sessionRouter.get('/products', async (req, res) => {
  const payload = await productsController.getProducts()
  
  res.render("products", {
    pathCSS: "products",
    pathJS: "products",
    payload: payload.docs,
    user: req.session.user
  })
})



export default sessionRouter
