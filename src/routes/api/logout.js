export function post(req, res) {

  req.session.destroy(function(err) {
    res.status(200).send('Successfully logged out')
  })
}