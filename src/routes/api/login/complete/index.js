export function get (req, res) {
	req.oauth.getAccessToken(req.session.requestToken, req.session.requestTokenSecret, req.query.oauth_verifier).then(body => {
		req.session.accessToken = body.accessToken
		req.session.accessTokenSecret = body.accessTokenSecret
		res.json({'status': 'success'})
	})
	.catch(error => {
		res.status(error.status).send(error.message)
	})
}