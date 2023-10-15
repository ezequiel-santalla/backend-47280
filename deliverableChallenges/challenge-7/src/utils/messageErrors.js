import passport from 'passport'

export const passportError = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) {
        return next(error)
      }

      if (!user) {
        return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
      }

      req.user = user
      next()
    })(req, res, next)
  }
}

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: "Unauthorized user" })
    }

    if (req.user.user.role != role) {
      return res.status(403).send({ error: "The user does not have the necessary privileges" })
    }

    next()
  }
}