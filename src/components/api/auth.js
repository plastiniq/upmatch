import loader from './loader.js'
import {API_URL} from './constants.js'

function getAuthLink () {
  return loader.post(API_URL + '/login', {
    url: 'http://localhost:3000/login/complete'
  })
}

function completeAuth (params) {
  return loader.get(API_URL + '/login/complete', params)
}

export {
  getAuthLink,
  completeAuth
}