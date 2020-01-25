import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import UpworkOAuth from '@upwork/upwork.js'
import redis from 'redis'
import nocache from 'nocache'

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const SESSION = require('express-session')
let RedisStore = require('connect-redis')(SESSION)
let redisClient = redis.createClient(process.env.REDIS_URL)

const APP = express()

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const OAUTH = new UpworkOAuth(process.env.UPWORK_KEY, process.env.UPWORK_SECRET)

APP.use(express.json())
APP.use(express.urlencoded({ extended: true }))
APP.use(nocache())

APP.listen(PORT, err => {
	if (err) console.log('error', err);
})

APP.use(SESSION({
	secret: process.env.SESSION_SECRET,
	store: new RedisStore({ client: redisClient }),
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

APP.use(function(req, res, next) {
	req.oauth = OAUTH
	next()
})

APP.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
)