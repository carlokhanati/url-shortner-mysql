'use strict';

const errorUtil = require('../../errors/utils');
const shortid = require('shortid');
const formidable = require('formidable');
// removes underscores and dashes from possible characterlist
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const validUrl = require('valid-url');
const readline = require('readline');
const fs = require('fs');

const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;
const SSLCERT = process.env.SSLCERT;
const mysql      = require('promise-mysql');

function createConnection() {
  return mysql.createConnection({
    host     : HOST,
    user     : USER,
    password : PASSWORD,
    database : DATABASE,
    ssl:{ca:fs.readFileSync(SSLCERT)}
  });
}

function getUrlCode(req, res) {
  const local = req.get('host');
  res.render('index', {host: local });
}

function prepareUrlUpload(req, res) {
  const local = req.get('host');
  res.render('upload', {host: local });
}

function handleUrlUpload(req, res, next) {
  const local = req.get('host') + "/";
  const form = new formidable.IncomingForm();
  var connection;
  createConnection().then((conn) =>{
  connection = conn 
  form.parse(req);
  
  form.on('fileBegin', function (name, file){
    file.path = __dirname + '/uploads/latesturls.txt'; 
  });
  
  form.on('file', function (name, file){
    file.path = __dirname + '/uploads/';

    var ws = fs.createWriteStream(file.path + 'lastestshortenurls.csv', { flags: 'w', defaultEncoding: 'utf8' })
    const rl = readline.createInterface({
      input: fs.createReadStream(file.path + 'latesturls.txt'),
    });

    rl.on('line', (line) => {
      const urlCode = line;
      const urlObj = {
        url: urlCode
      };
      connection.query('SELECT * FROM URLS WHERE original_url = ?', urlCode)
      .then((bResult)=> {
        if (bResult[0] !=null) {
          ws.write(`${urlCode},${local + bResult[0].short_url}\n`);
        }
        else if (validUrl.isUri(urlCode)) {
          // if URL is valid, do this
          var shortCode = shortid.generate();
          var newUrl = { original_url: urlCode, short_url: shortCode };
          const results =  connection.query('INSERT INTO URLS SET ?', newUrl).then((insertResult)=> {
            ws.write(`${urlCode},${local + shortCode}\n`);
          }).catch((insertError)=> {
            ws.write(`${urlCode},Saving url failed.\n`);
          });
          
        } else {
        // if URL is invalid, do this
          ws.write(`${urlCode},Wrong url format make sure you have a valid protocol and real site.\n`);
        };
      }).catch(()=> {
        ws.write(`${urlCode},Error occured.\n`);
      });
    })
    .on('close', () => {
      res.send('file uploaded');
      connection.end();
    });
   });
  });
}

function createUrl(req, res, next) {
  const urlCode = req.body.url;
  const urlObj = {
    url: urlCode
  };
  const local = req.get('host') + "/";
  var connection;
  var urlShorten;
  createConnection().then((conn)=> {
    connection = conn;
    return connection.query('SELECT * FROM URLS WHERE original_url = ?', urlCode);
  }).then((bResult)=> {
    if (bResult[0] !=null) {
      urlShorten= { original_url: urlCode, short_url: local + bResult[0].short_url };
    }
    else if (validUrl.isUri(urlCode)) {
      // if URL is valid, do this
      var shortCode = shortid.generate();
      var newUrl = { original_url: urlCode, short_url: shortCode };
      const results =  connection.query('INSERT INTO URLS SET ?', newUrl);
      urlShorten ={ original_url: urlCode, short_url: local + shortCode };
    } else {
    // if URL is invalid, do this
      urlShorten={ error: "Wrong url format, make sure you have a valid protocol and real site." };
    };
    return urlShorten;
  }).then((generatedUrl)=> {
    res.send(urlShorten);
    connection.end();
  }).catch(errorUtil.propagateError(next));
}

function getUrl(req, res, next) {
  const urlCode = req.params.short;
  var connection;
  createConnection().then((conn)=> {
    connection = conn;
    return connection.query('SELECT * FROM URLS WHERE short_url = ?', urlCode);
  }).then((bResult)=> {
    if (bResult[0] !=null) {
      res.redirect(bResult[0].original_url);
    } else {
    // if URL is invalid, do this
    res.json({ error: "No corresponding shortlink found in the database." });
    };
    connection.end();
  }).catch(errorUtil.propagateError(next));
}

function getLatestUrlUpload(req, res) {
  res.download(__dirname + '/uploads/lastestshortenurls.csv')
}
function respondRequest(res, code, message) {
  return function () {
    res.status(code);
    res.send(message);
    res.end();
  };
}

module.exports = {
  getUrlCode,
  createUrl,
  getUrl,
  prepareUrlUpload,
  handleUrlUpload,
  getLatestUrlUpload
};
