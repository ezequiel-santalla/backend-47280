import { Router } from 'express'
import passport from 'passport'
import { passportError, authorization } from '../utils/messageErrors.js'
import { generateToken } from '../utils/jwt.js'

const sessionRouter = Router()

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

    const token = generateToken(req.user)

    res.cookie('jwtCookie', token, {
      maxAge: 43200000
    })
    res.status(200).send({ payload: req.user })
  }

  catch (error) {
    res.status(500).send({ message: `Error logging ${error}` })
  }
})

sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: true }), async (req, res) => {
  res.status(200).send({ mensaje: req.user })
  req.session.user = {
    first_name: req.user.user.first_name,
    last_name: req.user.user.last_name,
    age: req.user.user.age,
    email: req.user.user.email
  }
})

sessionRouter.get('/current', passportError('jwt'), authorization('user'), (req, res) => {
  res.send(req.user)
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

export default sessionRouter