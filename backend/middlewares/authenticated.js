export function isAuthenticated (req, res, next) {
    if (req.session.user) next()
    else res.send('not authenticated.')
  }
