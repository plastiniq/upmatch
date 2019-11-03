export function post(req, res) {
  req.session.requestToken = null
  req.session.requestTokenSecret = null
  req.session.accessToken = null
  req.session.accessTokenSecret = null
  res.status(200).send('Successfully logged out')
}