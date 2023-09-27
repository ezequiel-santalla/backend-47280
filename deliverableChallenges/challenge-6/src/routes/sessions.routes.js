import { Router } from 'express'
import productsController from '../controllers/products.controller.js'
import passport from 'passport'

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

// Route to create a user
sessionRouter.post('/register', passport.authenticate('register'), async (req, res) => {
  try {
    if (!req.user) {
      res.status(400).send({ message: "Existing user" })
    }

    res.status(200).send({ message: "User created" })
  }

  catch (error) {
    res.status(500).send({ message: `Error creating user ${error}` })
  }
})

// Route to create a session locally
sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send({ message: "Invalidate password" })
    }

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age
    }

    res.redirect('/products')
  }

  catch (error) {
    res.status(500).send({ message: `Error logging ${error}` })
  }
})

// Route to authenticate with GitHub
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req, res) => {
  res.status(200).send({ message: 'User Created' })
})

// Route to create a session with GitHub
sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
  req.session.user = req.user
  res.status(200).send({ message: "Created Session" })
})

// Route to destroy a session
sessionRouter.get('/logout', (req, res) => {
  if (req.session.user) {
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

sessionRouter.get('/products', async (req, res) => {
  const page = req.query.page || 1

  const payload = await productsController.getProducts({ page })

  res.render("products", {
    pathCSS: "products",
    pathJS: "products",
    payload: payload.docs,
    user: req.session.user,
    currentPage: page,
    totalPages: payload.pages
  })
})

export default sessionRouter