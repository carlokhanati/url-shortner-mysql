const jwt = require('jsonwebtoken');

function jwtMiddleware(req, res, next) {
  const token = req.session.auth;
  if (token) {
    jwt.verify(token, 'urlShortener', (err, user) => {
      if (err) {
        const error = new Error('Invalid Credentials');
        res.render('login', {
          title: 'Login',
          error: error.message
        });
      }
      else {
        req.user = user;
        if (req.user.Permissions.includes(req.baseUrl.replace('/', ''))) {
          next();
        }
        else {
          res.redirect(`/${req.user.HomePage}?mode=view`);
        }
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
    const error = new Error('Invalid Credentials');
    res.render('login', {
      title: 'Login',
      error: error.message
    });
  }
}

function signToken(user) {
  return jwt.sign({ Email: user.Email, FullName: user.FullName, UserName: user.UserName, Permissions: user.Permissions.split(','), HomePage: user.HomePage }, 'urlShortener', { expiresIn: 60 * 60 });
}

module.exports = {
  jwtMiddleware,
  signToken
};
