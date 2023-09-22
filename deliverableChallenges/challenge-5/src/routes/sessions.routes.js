import { Router } from 'express'
import UserModel from '../models/users.model.js'

const sessionRouter = Router()

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
        req.session.login = true

        res.status(200).send({ result: 'Valid Login', message: loggedInUser })
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
        res.status(200).send({ result: 'Successfully logged out' })
      }
    })
  } else {
    res.status(401).send({ error: 'There is no active session' })
  }
})


export default sessionRouter
