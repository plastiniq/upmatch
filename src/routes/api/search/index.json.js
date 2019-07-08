export async function get (req, res) {
  req.oauth.fetch('GET', `/api/profiles/v2/search/jobs.json`, req.query, req.session.accessToken, req.session.accessTokenSecret).then(jobResp => {
    res.json(jobResp)
  }).catch(error => {
    res.status(error.status).send(error.message)
  })
}