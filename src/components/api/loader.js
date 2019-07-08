import axios from 'axios'

const instance = axios.create()
// instance.defaults.withCredentials = true
var attempt = 0

// instance.interceptors.response.use(function (response) {
//   if (response.data && response.data.statusCode === 429 && attempt < 100) {
//     console.log('too many requests, retry', attempt, response)
//     attempt++
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(instance(response.config)))
//     }, 100)
//   }
//   return Promise.resolve(response)
// }, function (error) {
//   return Promise.reject(error)
// })

export default instance