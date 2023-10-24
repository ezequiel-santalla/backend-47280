import passport from 'passport'
import local from 'passport-local'
import jwt from 'passport-jwt'
import GithubStrategy from 'passport-github2'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import UserModel from '../models/users.model.js'

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy

const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {
  const cookieExtractor = req => {

    const token = req.cookies ? req.cookies.jwtCookie : {}

    return token
  }

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET
  }, async (jwt_payload, done) => {
    try {
      return done(null, jwt_payload)
    }

    catch (error) {
      return done(error)
    }
  }))

  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
      const { first_name, last_name, email, age } = req.body

      try {
        const user = await UserModel.findOne({ email: username })

        if (user) {
          return done(null, true)
        }

        const hashPassword = createHash(password)
        const userCreated = await UserModel.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          age: age,
          password: hashPassword
        })
        return done(null, userCreated)
      }

      catch (error) {
        return done(error)
      }
    }
  ))

  passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
      const user = await UserModel.findOne({ email: username })

      if (!user) {
        return done(null, false)
      }

      if (validatePassword(password, user.password)) {
        return done(null, user)
      }

      return done(null, false)
    }

    catch (error) {
      return done(error)
    }
  }))

  passport.use('github', new GithubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  }, async (accesToken, refreshToken, profile, done) => {

    try {
      console.log(accesToken)
      console.log(refreshToken)
      const user = await UserModel.findOne({ email: profile._json.email })

      if (user) {
        done(null, user)
      } else {
        const userCreated = await UserModel.create({
          first_name: profile._json.name,
          last_name: ' ',
          email: profile._json.email,
          age: 18,
          password: 'password'
        })
        done(null, userCreated)
      }
    } catch (error) {
      done(error)
    }
  }
  ))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user)
  })
}

export default initializePassport