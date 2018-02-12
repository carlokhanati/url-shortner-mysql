const jwt = require('jsonwebtoken');

function jwtMiddleware(req, res, next){
    var token = req.session.auth;
    if (token) {
        jwt.verify(token,'urlShortener', (err, decode) => {
            if (err) {
                const error = new Error ('Invalid Token');
                error.status = 401;
                next(error);
            }
            else {
                req.user = decode;
                next();
            }
        })
    }
    else if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1],'urlShortener', (err, decode) => {
            if (err) {
                const error = new Error ('Invalid Token');
                error.status = 401;
                next(error);
            }
            else {
                req.user = decode;
                next();
            }
        })
    }
    else {
        const error = new Error('No token provided');
        error.status = 401;
        next(error);
    }
}

function signToken(user) {
    return jwt.sign({ email: user.email, fullName: user.fullName, id: user.id}, 'urlShortener',{ expiresIn: 60*60 })
}

module.exports = {
    jwtMiddleware,
    signToken
}