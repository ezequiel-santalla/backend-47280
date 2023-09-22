// Function for admin login
function auth(req, res, next) {
  if (req.session.email == 'ezequielasantalla@gmail.com' && req.session.password == process.env.ADMIN_PASSWORD) {
    return next()
  }

  return res.status(401).send("Access denied")
}

export default auth