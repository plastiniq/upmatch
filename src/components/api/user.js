import loader from './loader.js'
import {API_URL} from './constants.js'

function getMyInfo() {
  return loader.get(API_URL + 'get/auth/v1/info.json')
}

function getProfile(key) {
  return loader.get(API_URL + `get/profiles/v1/providers/${key}/brief.json`)
}

export {
  getMyInfo,
  getProfile
}