const mysql = require('mysql2');

//CONNECTION TO THE DB
const { DB_HOST, DB_UID, DB_PW, DB } = process.env;

const connection = mysql.createPool({
  host: DB_HOST,
  user: DB_UID,
  password: DB_PW,
  database: DB,
});

module.exports = connection;
