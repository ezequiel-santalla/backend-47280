import { Router } from 'express'
import {
  loginUser,
  testJWT,
  getCurrentSession,
  authenticateWithGitHub,
  createGitHubSession,
  logoutUser,
} from '../controllers/sessions.controller.js'

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login'), loginUser)
sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: true }), testJWT)
sessionRouter.get('/current', passportError('jwt'), authorization('user'), getCurrentSession)
sessionRouter.get('/github', authenticateWithGitHub)
sessionRouter.get('/githubSession', createGitHubSession)
sessionRouter.get('/logout', logoutUser)

export default sessionRouter
