const jwt = require('jsonwebtoken')

//token is sent as an authorization header
module.exports = (req, res, next) => {
  try {
    //eliminate Bearer from the auth token; we just need the 2nd element
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
    const userId = decodedToken.userId
    req.auth = { userId }
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID'
    } else {
      next()
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!'),
    })
  }
}
