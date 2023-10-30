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
    if (!req.user) {
      res.status(200).send({ result: "OK", message: "User Created" })
    }
    res.status(400).send({ message: "Existing user" })

  } catch (error) {
    res.status(500).send({ message: `Error creating user ${error}` })
  }
}

export const deleteUser = async (req, res) => {
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
}
