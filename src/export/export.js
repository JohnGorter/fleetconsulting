
const database = require('../database/database.js')
let converter = require('json-2-csv');
const fs = require('fs');
const { log } = require('../utils/utils.js')
 

function isXML(content) {
    return content.indexOf("<SOAP-ENV:" >= 0)
}

async function writeDataToCSV(filename, rows) {
    log("Generating CSV...")
    if (rows) {
        for (const [i, row] of rows) {
            if (isXML(row.data)){
                // todo
                console.log("skipping xml for now")
                log("skipping xml for now...")
            }
            else {
              converter.json2csv(JSON.parse(row.data), (err, csv) => {
                if (i == 0) {
                    if (fs.existsSync(filename)) fs.rmSync(filename)
                    fs.writeFileSync(filename, csv);
                }
                else 
                    fs.appendFileSync(filename, csv);
                }, {expandArrayObjects:true}
              )
            }
        }
    }
    Promise.resolve();
}

async function getDataFromCloud(conn, q) {
    log("Getting data from database..")
    const result = await database.query(conn, q);
    return result.entries();
}

module.exports = { writeDataToCSV, getDataFromCloud }
