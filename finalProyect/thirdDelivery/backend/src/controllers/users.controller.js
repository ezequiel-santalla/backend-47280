import UserModel from '../models/users.model.js'

export const getUsers = async (req, res) => {
  const { limit } = req.query

  try {
    const foundUsers = await UserModel.find().limit(limit)

    res.status(200).send({ result: "OK", message: foundUsers })
  }

  catch (error) {
    res.status(400).send({ error: `Error consulting the users: ${error}` })
  }
}

export const getUser = async (req, res) => {
  const { uid } = req.params

  try {
    const foundUser = await UserModel.findById(uid)

    if (foundUser)
      res.status(200).send({ result: "OK", message: foundUser })
    else
      res.status(404).send({ result: "User Not Found", message: foundUser })
  }

  catch (error) {
    res.status(400).send({ error: `Error consulting the user: ${error}` })
  }
}

export const postUser = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email })

    if (!existingUser) {
      const newUser = await UserModel.create(req.body);

      res.status(201).send({ result: "Created", message: newUser })
    } else {
      res.status(400).send({ message: "User already exists" })
    }
  } catch (error) {
    res.status(500).send({ error: `Error creating user: ${error.message}` })
  }
}

export const deleteUser = async (req, res) => {
  const { uid } = req.params

  try {
    const deletedUser = await UserModel.findByIdAndDelete(uid)

    if (deletedUser) {
      res.status(200).send({ result: 'OK', message: deletedUser })
    } else {
      res.status(404).send({ result: 'User Not Found', message: 'User not found or already deleted' })
    }
  } catch (error) {
    res.status(500).send({ error: `Error deleting the user: ${error}` })
  }
}

