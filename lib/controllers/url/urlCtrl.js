'use strict';

const errorUtil = require('../../errors/utils');
const shortid = require('shortid');
const formidable = require('formidable');
const db = require('../../utils/db');

// removes underscores and dashes from possible characterlist
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const validUrl = require('valid-url');
const readline = require('readline');
const fs = require('fs');

function getUrlCode(req, res) {
  db.getConnection().then((conn) => {
    const result = conn.query('select * from Urls');
    conn.end();
    return result;
  }).then((rows) => {
    const UrlsString = JSON.stringify(rows);
    const Urls = JSON.parse(UrlsString);
    if (req.query.mode === 'view') {
      res.render('url',
        {
          title: 'Url Shortener',
          data: Urls
        }
      );
    }
    else {
      res.status(200);
      res.send(Urls);
    }
    res.end();
  });
}

function prepareUrlUpload(req, res) {
  res.render('upload', { uploaded: false, title: 'Url Shortener' });
}

function loadMultipleUrl(urlArray, res, local, user) {
  const urlArrayLength = urlArray.length;
  let urlCount = 0;
  let connection;
  const ws = fs.createWriteStream(`${__dirname}/uploads/lastestshortenurls.csv`, { flags: 'w', defaultEncoding: 'utf8' });
  const dateUpload = new Date();
  db.getConnection().then((conn) => {
    connection = conn;
    if (urlArray.length > 0) {
      urlArray.forEach((urlObj) => {
        connection.query('SELECT * from Urls WHERE original_url = ?', urlObj)
        .then((bResult) => {
          if (bResult[0] != null) {
            ws.write(`${urlObj},${local + bResult[0].short_url}\n`);
          }
          else if (validUrl.isUri(urlObj)) {
            // if URL is valid, do this
            const shortCode = shortid.generate();
            const newUrl = { original_url: urlObj, short_url: shortCode, visited: 0, added_date: dateUpload, added_user: user.UserName };
            const results = connection.query('INSERT INTO Urls SET ?', newUrl).then(() => {
              ws.write(`${urlObj},${local + shortCode}\n`);
            }).catch(() => {
              ws.write(`${urlObj},Saving url failed.\n`);
            });
          }
          else {
          // if URL is invalid, do this
            ws.write(`${urlObj},Wrong url format make sure you have a valid protocol and real site.\n`);
          }
          urlCount += 1;
          if (urlArrayLength === urlCount) {
            res.redirect('/url?mode=view');
          }
        }).catch((e) => {
          urlCount += 1;
          ws.write(`${urlObj},Error occured.\n`);
          if (urlArrayLength === urlCount) {
            res.redirect('/url?mode=view');
          }
        });
      });
    }
    else {
      res.redirect('/url?mode=view');
    }
  });
}

function handleUrlUpload(req, res, next) {
  const local = `${req.get('host')}/`;
  const form = new formidable.IncomingForm();

  const loadedUrls = [];

  form.parse(req);

  form.on('fileBegin', (name, file) => {
    file.path = `${__dirname}/uploads/latesturls.txt`;
  });

  form.on('file', (name, file) => {
    file.path = `${__dirname}/uploads/`;

    const ws = fs.createWriteStream(`${file.path}lastestshortenurls.csv`, { flags: 'w', defaultEncoding: 'utf8' });
    const rl = readline.createInterface({
      input: fs.createReadStream(`${file.path}latesturls.txt`),
    });

    rl.on('line', (line) => {
      loadedUrls.push(line);
    })
    .on('close', () => {
      loadMultipleUrl(loadedUrls, res, local, req.user);
    });
  });
}

function createUrl(req, res, next) {
  const urlCode = req.body.url;
  const urlObj = {
    url: urlCode
  };
  const local = `${req.get('host')}/`;
  let connection;
  let urlShorten;
  db.getConnection().then((conn) => {
    connection = conn;
    return connection.query('SELECT * from Urls WHERE original_url = ?', urlCode);
  }).then((bResult) => {
    if (bResult[0] != null) {
      urlShorten = { original_url: urlCode, short_url: local + bResult[0].short_url };
    }
    else if (validUrl.isUri(urlCode)) {
      // if URL is valid, do this
      const shortCode = shortid.generate();
      const newUrl = { original_url: urlCode, short_url: shortCode, added_date: new Date(), visited: 0, added_user: req.user.UserName };
      const results = connection.query('INSERT INTO Urls SET ?', newUrl);
      urlShorten = { original_url: urlCode, short_url: local + shortCode };
    }
    else {
    // if URL is invalid, do this
      urlShorten = { error: 'Wrong url format, make sure you have a valid protocol and real site.' };
    }
    return urlShorten;
  }).then(() => {
    res.send(urlShorten);
    connection.end();
  }).catch(errorUtil.propagateError(next));
}

function getUrl(req, res, next) {
  const urlCode = req.params.short;
  let connection;
  db.getConnection().then((conn) => {
    connection = conn;
    return connection.query('SELECT * from Urls WHERE short_url = ?', urlCode);
  }).then((bResult) => {
    if (bResult[0] != null) {
      connection.query('Update Urls set visited=visited+1 where short_url=?', urlCode);
      res.redirect(bResult[0].original_url);
    }
    else {
    // if URL is invalid, do this
      res.json({ error: 'No corresponding shortlink found in the database.' });
    }
    connection.end();
  }).catch(errorUtil.propagateError(next));
}

function getLatestUrlUpload(req, res) {
  res.download(`${__dirname}/uploads/lastestshortenurls.csv`);
}

function respondRequest(res, code, message) {
  return function () {
    res.status(code);
    res.send(message);
    res.end();
  };
}

function deleteUrl(req, res) {
  db.getConnection().then((conn) => {
    const result = conn.query('Delete from Urls where short_url = ?', [req.params.short_url]);
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

module.exports = {
  getUrlCode,
  createUrl,
  getUrl,
  prepareUrlUpload,
  handleUrlUpload,
  getLatestUrlUpload,
  deleteUrl
};
