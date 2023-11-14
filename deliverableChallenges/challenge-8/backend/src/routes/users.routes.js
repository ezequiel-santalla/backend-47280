import { Router } from 'express'
import {
  getUsers,
  getUser,
  postUser,
  deleteUser
} from '../controllers/users.controller.js'

const userRouter = Router()

userRouter.get('/', getUsers)
userRouter.get('/', getUser)
userRouter.post('/', postUser)
userRouter.delete('/', deleteUser)

export default userRouter