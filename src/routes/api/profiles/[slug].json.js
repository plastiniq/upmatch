export async function get (req, res) {
  const { slug } = req.params
  var profilesArr = slug.split(';')
  return getProfiles(req, profilesArr).then(data => {
    data.profiles = (data.profile && [data.profile]) || data.profiles.profile || data.profiles
    res.json(data)
  }).catch(error => {
    res.status(error.status).send(error.statusText)
  })
}

function getProfiles (req, profilesArr, excludeArr) {
  if (!profilesArr || !profilesArr.length) {
    return Promise.reject({ status: 400, statusText: 'No valid profile keys in the request'})
  }

  excludeArr = excludeArr || []
  let keys = profilesArr.filter(v => excludeArr.indexOf(v) === -1).slice(0, 10).join(';')
  return req.oauth.fetch('GET', `/api/profiles/v1/providers/${keys}/brief.json`, null, req.session.accessToken, req.session.accessTokenSecret)
  .catch(error => {
    if (error.status == 403) {
      excludeArr.push(JSON.parse(error.data).error.message.match(/[~^][^/$\s]{18}/)[0])
      return getProfiles(req, profilesArr, excludeArr)
    } else {
      return Promise.reject(error)
    }
  })
}