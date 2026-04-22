const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// A simple test to check connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err.message);
        // It's possible the DB doesn't exist yet, we will handle that in init_db.js
    } else {
        console.log('Successfully connected to MySQL database');
        connection.release();
    }
});

module.exports = pool.promise();
