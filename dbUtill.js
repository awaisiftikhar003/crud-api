require('dotenv').config()
var mysql = require('mysql');
let connection = null
var counter = 1
module.exports = function () {
    if (connection == null) {
        connection = mysql.createConnection({
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });
    }
    return connection
};



