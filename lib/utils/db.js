const mysql = require('promise-mysql');
const SSLCERT = process.env.SSLCERT;
function getConnection() {
  return mysql.createConnection({
    host: process.env.DBHOST || process.env.APPSETTING_DBHOST,
    user: process.env.DBUSER || process.env.APPSETTING_DBUSER,
    password: process.env.DBPASSWORD || process.env.APPSETTING_DBPASSWORD,
    database: process.env.DBNAME || process.env.APPSETTING_DBNAME,
    dateStrings: true
  });
}

module.exports = {
  getConnection,
};
