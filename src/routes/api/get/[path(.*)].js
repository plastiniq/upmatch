export function get (req, res) {
  const { path } = req.params
  if (!(req.session.accessToken && req.session.accessTokenSecret)) {
    return res.status(401).end()
	}
  return req.oauth.fetch('GET', `/api/${path}`, null, req.session.accessToken, req.session.accessTokenSecret).then(data => {
    res.json(data)
  }).catch(error => {
    res.status(error.status).send(error.statusText)
  })
}