const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.HOST,
    database: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
});

module.exports = pool;
