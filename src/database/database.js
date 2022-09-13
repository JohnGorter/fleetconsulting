
const mysql = require('mysql');
const { log } = require('../utils/utils.js')

async function insert(env, data) { 
    return new Promise((res, rej) => {
        var connection = mysql.createConnection(env);
        connection.connect();
        log("Inserting data into the database...")
        connection.query(`INSERT INTO fleet_data(\`data\`) VALUES ('${JSON.stringify(data)}')`, function(err, rows, fields) {
            if (!err) res()
            else rej(err)
            connection.end();
        }); 
    });
} 

async function query(env, q) { 
    return new Promise((res, rej) => {
        var connection = mysql.createConnection(env);
        connection.connect();
        log("Querying the database...")
        connection.query(`${q}`, function(err, rows, fields) {
            if (!err) res(rows)
            else rej(err)
            connection.end();
        }); 
        
    });
}

module.exports = {
    insert, 
    query
}