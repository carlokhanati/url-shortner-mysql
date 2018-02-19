const jwt = require('jsonwebtoken');

function jwtMiddleware(req, res, next) {
  const token = req.session.auth;
  if (token) {
    jwt.verify(token, 'urlShortener', (err, user) => {
      if (err) {
        const error = new Error('Invalid Token');
        res.render('login', {
          title: 'Login',
          error: error.message
        });
      }
      else {
        req.user = user;
        next();
      }
    });
  }
  else if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'urlShortener', (err, user) => {
      if (err) {
        const error = new Error('Invalid Token');
        error.status = 401;
        next(error);
        // res.status(401);
        // res.redirect(`/login?error=${error.message}`);
      }
      else {
        req.user = user;
        next();
      }
    });
  }
  else {
    const error = new Error('No token provided');
    res.render('login', {
      title: 'Login',
      error: error.message
    });
  }
}

function signToken(user) {
  return jwt.sign({ Email: user.Email, FullName: user.FullName, UserName: user.UserName }, 'urlShortener', { expiresIn: 60 * 60 });
}

module.exports = {
  jwtMiddleware,
  signToken
};
