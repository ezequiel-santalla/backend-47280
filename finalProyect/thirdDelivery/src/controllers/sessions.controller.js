import passport from 'passport'
import { generateToken } from '../utils/jwt.js'

export const loginUser = async (req, res) => {
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
  } catch (error) {
    res.status(500).send({ message: `Error logging ${error}` })
  }
}

export const testJWT = async (req, res) => {
  res.status(200).send({ mensaje: req.user });
  req.session.user = {
    first_name: req.user.user.first_name,
    last_name: req.user.user.last_name,
    age: req.user.user.age,
    email: req.user.user.email
  }
}

export const getCurrentSession = (req, res) => {
  res.send(req.user)
}

export const authenticateWithGitHub = passport.authenticate('github', { scope: ['user:email'] })

export const createGitHubSession = passport.authenticate('github')

export const logoutUser = (req, res) => {
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
}
