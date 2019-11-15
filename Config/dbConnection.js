const MySQL = require('mysql');

const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'node'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!!")
});

module.exports = connection;