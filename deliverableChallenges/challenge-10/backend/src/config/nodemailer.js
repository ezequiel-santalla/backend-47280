import logger from '../utils/loggers.js'
import nodeMailer from 'nodemailer'
import 'dotenv/config.js'

export const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVICE,
    pass: process.env.PASSWORD_EMAIL,
    authMethod: 'LOGIN',
  },
});