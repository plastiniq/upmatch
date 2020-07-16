import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import UpworkOAuth from '@upwork/upwork.js'
import nocache from 'nocache'

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const session = require('express-session')
var sessionStore = null

if (!dev) {
	let RedisStore = require('connect-redis')(session)
	let redisClient = require('redis').createClient(process.env.REDIS_URL);
	sessionStore = new RedisStore({ client: redisClient }) 
}

const app = express()
const oauth = new UpworkOAuth(process.env.UPWORK_KEY, process.env.UPWORK_SECRET)

app.use(
	express.json(),
	express.urlencoded({ extended: true }),
	nocache(),
	session({
		secret: process.env.SESSION_SECRET,
		store: sessionStore,
		resave: false,
		saveUninitialized: true,
		cookie: {}
	}),
	function(req, res, next) {
		req.oauth = oauth
		next()
	},
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
)
.listen(PORT, err => {
	if (err) console.log('error', err);
})
