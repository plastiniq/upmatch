import loader from './loader.js'
import * as userAPI from './user.js'
import {API_URL} from './constants.js'

const getJob = function (key) {
  return loader.get(API_URL + `/profiles/v1/jobs/${key}.json`)
}

const getProfiles = function (profilesArr, excludeArr) {
  excludeArr = excludeArr || []
  return userAPI.getProfile(profilesArr.filter(v => excludeArr.indexOf(v) === -1).slice(0, 10).join(';')).then(resp => {
    if (resp.data.statusCode == 403) {
      excludeArr.push(JSON.parse(resp.data.data).error.message.match(/[~^][^/$\s]{18}/)[0])
      return getProfiles(profilesArr, excludeArr)
    } else {
      return Promise.resolve(resp)
    }
  })
}

const getFreelancers = function (jobKey) {
  return getJob(jobKey).then((jobResp) => {

    if (jobResp.data) {
      var profiles = getAssignments(jobResp)
      if (profiles && profiles.length) {
        return getProfiles(profiles)
      } else {
        return Promise.reject(new Error('Customer has no hiring experience'))
      }
    } else {
      return Promise.reject(new Error('Error loading data'))
    }
  })
}

function getAssignments (response) {
  let assignments = (response.data.profile.assignments && response.data.profile.assignments.assignment) || response.data.profile.assignment || response.data.profile.assignments
  return (Array.isArray(assignments) ? assignments : [assignments]).map(v => v.as_ciphertext)
}

export {
  getJob,
  getFreelancers,
  getProfiles,
  getAssignments
}