export async function get (req, res) {
  const { slug } = req.params
  req.oauth.fetch('GET', `/api/profiles/v1/jobs/${slug}.json`, null, req.session.accessToken, req.session.accessTokenSecret).then(jobResp => {
    res.json(jobResp)
  }).catch(error => {
    res.status(error.status).send(error.statusText)
  })
}