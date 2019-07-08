export async function get (req, res) {
  const { slug } = req.params
  var profilesArr = slug.split(';')
  
  return getProfiles(req, profilesArr).then(data => {
    data.profiles = data.profiles.profile || data.profiles
    res.json(data)
  }).catch(error => {
    res.status(error.status).send(error.message)
  })
}

function getProfiles (req, profilesArr, excludeArr) {
  excludeArr = excludeArr || []
  let keys = profilesArr.filter(v => excludeArr.indexOf(v) === -1).slice(0, 10).join(';')
  return req.oauth.fetch('GET', `/api/profiles/v1/providers/${keys}/brief.json`, null, req.session.accessToken, req.session.accessTokenSecret).then(resp => {
    if (resp.statusCode == 403) {
      excludeArr.push(JSON.parse(resp.data.data).error.message.match(/[~^][^/$\s]{18}/)[0])
      return getProfiles(req, profilesArr, excludeArr)
    } else {
      return Promise.resolve(resp)
    }
  })
}