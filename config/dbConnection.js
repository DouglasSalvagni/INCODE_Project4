const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'1234',
    database:'project4'
});
connection.connect((err)=>{
    if(err) throw err;
    console.log('Connected with database.');
});

module.exports = connection;