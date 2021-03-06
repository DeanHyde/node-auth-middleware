const session = require('express-session');
const RedisStore = require('connect-redis')(session);

module.exports.checkAuth = function(req, res, next) {

  if (req.session !== undefined && req.session.authenticated)
    return next();

  res.redirect(process.env.APP_AUTH_MANAGER_NODE_URL + '/login?redirect='+process.env.APP_URL);
}


module.exports.setToken = function(req, res) {

  // If we have a session ID in our query params, use that as our new session ID and redirect to homepage
  if (req.query.sessionID !== undefined) {
    
    res.cookie('usay_session', decodeURIComponent(req.query.sessionID));
    // Now redirect to homepage
    res.redirect('/');

  } else {
    console.log('failed setting session');
  }

}

module.exports.session = function() {
  return session({
    store: new RedisStore({host: 'redis', port: 6379}),
    secret: 'keyboard cat',
    name: 'usay_session',
    resave: false,
    saveUninitialized: false,
  })
}