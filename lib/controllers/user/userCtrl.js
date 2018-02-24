const db = require('../../utils/db');
const jwt = require('../../utils/jwt');
const bcrypt = require('bcrypt');

const saltRounds = 10;
function login(req, res) {
  res.render('login', { title: 'Login' });
}
function getUsers(req, res) {
  db.getConnection().then((conn) => {
    const result = conn.query('select * from Users');
    conn.end();
    return result;
  }).then((rows) => {
    const UsersString = JSON.stringify(rows);
    const Users = JSON.parse(UsersString);
    if (req.query.mode === 'view') {
      res.render('users',
        {
          title: 'Users',
          data: Users
        }
      );
    }
    else {
      res.status(200);
      res.send(Users);
    }
    res.end();
  });
}

function getUserPermissions(req, res) {
  // db.getConnection().then((conn) => {
  //   const result = conn.query('select * from Users where UserName = ?', [req.user.UserName]);
  //   conn.end();
  //   return result;
  // }).then((rows) => {
  //   const UserString = JSON.stringify(rows);
  //   const User = JSON.parse(UserString);
  //   res.send(User[0]);
  //   res.end();
  // }).catch((e) => {
  //   res.status(500);
  //   res.send(e);
  //   res.end();
  // });
  res.send(req.user);
  res.end();
}

function getUser(req, res) {
  db.getConnection().then((conn) => {
    const result = conn.query('select * from Users where UserName = ?', [req.params.UserName]);
    conn.end();
    return result;
  }).then((rows) => {
    const UserString = JSON.stringify(rows);
    const User = JSON.parse(UserString);
    res.send(User[0]);
    res.end();
  }).catch((e) => {
    res.status(500);
    res.send(e);
    res.end();
  });
}

function deleteUser(req, res) {
  db.getConnection().then((conn) => {
    const result = conn.query('Delete from Users where UserName = ?', [req.params.UserName]);
    conn.end();
    return result;
  }).then(() => {
    res.status(201);
    res.end();
  }).catch((e) => {
    res.status(500);
    res.send(e);
    res.end();
  });
}

function addUser(req, res) {
  db.getConnection().then((conn) => {
    const jsonData = req.body;
    jsonData.Password = bcrypt.hashSync(jsonData.Password, saltRounds);
    const result = conn.query('insert into Users SET ?', jsonData);
    conn.end();
    return result;
  }).then(() => {
    res.status(201);
    res.send();
    res.end();
  }).catch((e) => {
    res.status(500);
    res.send(e.message);
    res.end();
  });
}
function updateUser(req, res) {
  db.getConnection().then((conn) => {
    const jsonData = req.body;
    delete jsonData.Password;
    const result = conn.query('update Users SET ? where UserName = ?', [jsonData, req.params.UserName]);
    conn.end();
    return result;
  }).then(() => {
    res.status(201);
    res.send();
    res.end();
  }).catch((e) => {
    res.status(500);
    res.send(e);
    res.end();
  });
}

function updatePassword(req, res) {
  db.getConnection().then((conn) => {
    const jsonData = req.body;
    jsonData.Password = bcrypt.hashSync(jsonData.Password, saltRounds);
    const result = conn.query('update Users SET Password=? where UserName = ?', [jsonData.Password, req.params.UserName]);
    conn.end();
    return result;
  }).then(() => {
    res.status(201);
    res.send();
    res.end();
  }).catch((e) => {
    res.status(500);
    res.send(e);
    res.end();
  });
}
function authenticateUser(req, res, next) {
  db.getConnection().then((conn) => {
    const result = conn.query('select * from Users where UserName = ? or Email = ?', [req.body.UserName, req.body.UserName]);
    conn.end();
    return result;
  }).then((rows) => {
    const UserString = JSON.stringify(rows);
    const User = JSON.parse(UserString);
    const foundUser = User[0];
    if (foundUser) {
      bcrypt.compare(req.body.Password, foundUser.Password).then((result) => {
        if (result) {
          const token = jwt.signToken(foundUser);
          req.session.auth = token;
          if (req.body.mode === 'view') {
            res.redirect(`/${foundUser.HomePage}?mode=view`);
          }
          else {
            res.send({ token });
            res.end();
          }
        }
        else {
          const error = new Error('Invalid Password');
          res.render('login', {
            title: 'Login',
            error: error.message
          });
        }
      });
    }
    else {
      const error = new Error('Invalid UserName');
      if (req.body.mode === 'view') {
        res.render('login', {
          title: 'Login',
          error: error.message
        });
      }
      else {
        res.status(401);
        next(error);
      }
    }
  }).catch((e) => {
    res.status(500);
    res.send(e);
    res.end();
  });
}
module.exports = {
  getUsers,
  getUser,
  getUserPermissions,
  addUser,
  updateUser,
  deleteUser,
  authenticateUser,
  updatePassword,
  login
};
