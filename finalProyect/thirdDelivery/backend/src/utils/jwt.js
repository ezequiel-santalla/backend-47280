import 'dotenv/config'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'

export const generateToken = (user) => {
  const token = jwt.sign({ user }, config.jwtSecret, { expiresIn: '12h' })

  return token
}

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).send({ error: "Unauthenticated User" })
  }

  const token = authHeader.split(' ')[1]

  jwt.sign(token, config.jwtSecret, (error, credentials) => {
    if (error) {
      return res.status(403).send({ error: "Unauthorized User" })
    }

    req.user = credentials.user
    next()
  })
}

