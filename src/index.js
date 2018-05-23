const session = require('express-session');
const RedisStore = require('connect-redis')(session);

module.exports = usayAuth;
module.exports = setToken;
module.exports = usaySession;

function usayAuth() {

  return function usayAuth(req, res, next) {

    if (req.session.authenticated)
      return next();

    res.redirect(process.env.APP_AUTH_MANAGER_NODE_URL + '/login?redirect='+process.env.APP_URL);
  }
}

function setToken() {
  return function setToken(req, res) {

    // If we have a session ID in our query params, use that as our new session ID and redirect to homepage
    if (req.query.sessionID) {
      req.session.regenerate(function(err) {
        // will have a new session here
      });
      // Now redirect to homepage
      res.redirect('/');

    } else {
      console.log('failed setting session');
    }
  }
}

function usaySession() {
  return session({
    store: new RedisStore({host: 'redis', port: 6379}),
    secret: 'keyboard cat',
    name: 'usay_session',
    resave: false,
    saveUninitialized: false,
    genid: function(req) {
      // Set session ID from the sessionID query parameter send from the auth service
      return req.query.sessionID;
    },
  })
}