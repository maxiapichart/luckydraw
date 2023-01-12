const jwt = require('jsonwebtoken')

const { TOKEN_KEY } = process.env

module.exports = (req, res, next) => {
  const { token } = req.headers
  if (!token)
    return res.status(403).send('A token is require for authentication')
  try {
    req.user = jwt.verify(token, TOKEN_KEY)
  } catch (error) {
    return res.status(401).send('Invalid Token')
  }
  return next()
}
