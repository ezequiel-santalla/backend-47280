import dotenv from 'dotenv'

dotenv.config()

const config = {
  mongoUrl: process.env.MONGO_URL,
  signedCookies: process.env.SIGNED_COOKIES,
  sessionSecret: process.env.SESSION_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  salt: process.env.SALT,
  appId: process.env.APP_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackUrl: process.env.CALLBACK_URL
}

export default config
