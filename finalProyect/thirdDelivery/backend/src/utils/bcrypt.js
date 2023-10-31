import 'dotenv/config'
import bcrypt from 'bcrypt'
import config from '../config/config.js'

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(config.salt)))

export const validatePassword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD)

