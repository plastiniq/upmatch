import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import UpworkOAuth from '@upwork/upwork.js'

const SESSION = require('express-session')
var FileStore = require('session-file-store')(SESSION)


const APP = express()

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const OAUTH = new UpworkOAuth('6d09492ef0d2b2fc893ed6d7895544ed', '68646f95f3a62fc4')

APP.use(express.json())
APP.use(express.urlencoded({ extended: true }))

APP.listen(PORT, err => {
	if (err) console.log('error', err);
})

APP.use(SESSION({
	secret: 'sj7gebmv6oxz',
	store: new FileStore({}),
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

APP.use(function(req, res, next) {
	req.oauth = OAUTH
	next()
})

// APP.get('/api/complete-auth', (req, res) => {
// 	console.log(req.url)
// 	console.log('complete-auth', req.session.requestToken, req.session.requestTokenSecret)
//   if (req.session.requestToken && req.session.requestTokenSecret) {
//     OAUTH.getAccessToken(req.session.requestToken, req.session.requestTokenSecret, req.query.oauth_verifier).then(body => {
// 			req.session.accessToken = body.accessToken
// 			req.session.accessTokenSecret = body.accessTokenSecret
// 			res.json({'status': 'success'})
// 		})
// 		.catch(error => {
// 			console.log('getAccesTokenError', error)
// 			res.json({'status': 'error', error})
// 		})
//   } else {
// 		console.log('no Access Token')
// 		res.status(401)
//   }
// })

// APP.post('/api/auth', (req, res) => {
// 		console.log('auth')
// 		OAUTH.getAuthorizeUrl(req.body && req.body.url).then(body => {
// 			req.session.requestToken = body.requestToken
// 			req.session.requestTokenSecret = body.requestTokenSecret
// 			res.json({ url: body.url })
// 		}).catch(error => res.json(error))
// })

// APP.post('/api/logout', (req, res) => {
// 	console.log('logout')
//   req.session.upwork = null
//   res.status(200).end()
// })

// APP.get('/api/*', (req, res) => {
// 	console.log('get')
//   if (!(req.session.accessToken && req.session.accessTokenSecret)) {
//     return res.status(401).end()
// 	}

//   return OAUTH.fetch('GET', req.params[0], null, req.session.accessToken, req.session.accessTokenSecret).then(data => {
//     res.json(data)
//   }).catch(error => {
//     res.json(error)
//   })
// })

APP.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
)