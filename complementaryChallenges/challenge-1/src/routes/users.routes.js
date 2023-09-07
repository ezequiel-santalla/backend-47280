import { Router } from 'express'
import UserModel from '../models/users.models.js'

const userRouter = Router()

userRouter.get('/', async (req, res) => {
  const { limit } = req.query

  try {
    const foundUsers = await UserModel.find().limit(limit)

    res.status(200).send({ result: 'OK', message: foundUsers })
  }

  catch (error) {
    res.status(400).send({ error: `Error consulting the users: ${error}` })
  }
})

userRouter.post('/', async (req, res) => {
  const { name, lastName, username, password, email } = req.body

  try {
    const addedUser = await UserModel.create({
      name, lastName, username, password, email
    })

    res.status(200).send({ result: 'OK', message: addedUser})
  }

  catch (error) {
    res.status(400).send({ error: `Error creating the user: ${error}` })
  }
})


export default userRouter