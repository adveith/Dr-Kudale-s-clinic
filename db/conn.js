

const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost', // Usually 'localhost' if MySQL is installed locally
    user: 'root',
    password: 'Adveith@17',
    database: 'clinic'
  });


  module.exports = pool;