export function post(req, res) {	
		req.oauth.getAuthorizeUrl(req.body && req.body.url).then(body => {
			req.session.requestToken = body.requestToken
			req.session.requestTokenSecret = body.requestTokenSecret
			res.json({ url: body.url })
		}).catch(error => res.json(error))
}