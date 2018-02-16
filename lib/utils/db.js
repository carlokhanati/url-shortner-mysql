const mysql = require('promise-mysql');
const SSLCERT = process.env.SSLCERT;

function getConnection() {
  return mysql.createConnection({
    host: process.env.HOST || process.env.APPSETTING_HOST,
    user: process.env.USER || process.env.APPSETTING_USER,
    password: process.env.PASSWORD || process.env.APPSETTING_PASSWORD,
    database: process.env.DATABASE || process.env.APPSETTING_DATABASE,
    dateStrings: true
  });
}

module.exports = {
  getConnection,
};
