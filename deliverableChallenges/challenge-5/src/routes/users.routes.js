import { Router } from 'express'
import UserModel from '../models/users.model.js'

const userRouter = Router()

// Route to get all users
userRouter.get('/', async (req, res) => {
  const { limit } = req.query

  try {
    const foundUsers = await UserModel.find().limit(limit)

    res.status(200).send({ result: "OK", message: foundUsers })
  }

  catch (error) {
    res.status(400).send({ error: `Error consulting the users: ${error}` })
  }
})

// Route to get an user by ID
userRouter.get('/:uid', async (req, res) => {
  const { uid } = req.params

  try {
    const foundUser = await UserModel.findById(uid)

    if (foundUser)
      res.status(200).send({ result: 'OK', message: foundUser })
    else
      res.status(404).send({ result: 'User Not Found', message: foundUser })
    }

  catch (error) {
    res.status(400).send({ error: `Error consulting the user: ${error}` })
  }
})

// Route to create an user
userRouter.post('/', async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body

  try {
    const createdUser = await UserModel.create({ first_name, last_name, email, password, age })

    res.status(200).send({ message: 'User Created', response: createdUser })
  }

  catch (error) {
    res.status(400).send({ error: `Error creating user: ${error}` })
  }
})

// Route to delete a user
userRouter.delete('/:uid', async (req, res) => {
  const { uid } = req.params

  try {
    const deletedUser = await UserModel.findByIdAndDelete(uid)

    if (deletedUser)
      res.status(200).send({ result: 'ok', message: deletedUser })
    else
      res.status(404).send({ result: 'User Not Found', message: deletedUser })
    }

  catch (error) {
    res.status(400).send({ error: `Error deleting the user: ${error}` })
  }
})

export default userRouter