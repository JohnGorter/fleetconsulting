const express = require('express')
const fs = require('fs');
const http = require('http');
const https = require('https');
const { setFlagsFromString } = require('v8');
const { storeDataInCloud } = require('../import/import.js')
const { writeDataToCSV, getDataFromCloud } = require("../export/export.js")
const privateKey  = fs.readFileSync(__dirname + '/certs/server-key.pem', 'utf8');
const certificate = fs.readFileSync(__dirname + '/certs/server-cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const app = express();
const { log } = require('../utils/utils.js')
const env = require("../../env.json");
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

var httpsServer = https.createServer(credentials, app);
var httpServer = http.createServer(app);

async function startServerInternal(port) {
    app.use(express.static("."))
    app.use(express.text({type:'*/*'}))
    app.post('/setInterval', (req, res) => {
        let i = JSON.parse(req.body)
        log("setting interval to " + i.interval)
        globalThis.interval = i.interval
        res.end("OK")
    })
    app.post('/clearLog', (req, res) => {
        fs.rmSync("log.txt")
        fs.writeFileSync("log.txt", "")
        res.end("OK")
    })
    app.get("/getcsv", async (req, res) => {
        await writeDataToCSV("data.csv", await getDataFromCloud(env.mysql, env.mysql.query))
        res.sendFile(appDir + "/data.csv")
    })
    app.get("/message", (req, res) => {
        log("body: " + req.body.substr(0,20))
        storeDataInCloud(env.mysql, req.body)
        res.header("Content-Type", "text/xml")        
        res.statusCode = 200
        res.end(`<s:Envelope xmlns:s=http://schemas.xmlsoap.org/soap/envelope/><s:Body><ns2:PushResponse xmlns:ns2=http://v3.push.ws.nicplace.com/><success>true</success></ns2:PushResponse></s:Body></s:Envelope>`)
    })
    app.post("/message", (req, res) => {
        log("body: " + req.body.substr(0,20))
        storeDataInCloud(env.mysql, req.body)
        res.header("Content-Type", "text/xml")        
        res.statusCode = 200
        res.end(`<s:Envelope xmlns:s=http://schemas.xmlsoap.org/soap/envelope/><s:Body><ns2:PushResponse xmlns:ns2=http://v3.push.ws.nicplace.com/><success>true</success></ns2:PushResponse></s:Body></s:Envelope>`)
    })
    httpServer.listen(port, () => { log(`server started at ${port}`)})
}

module.exports = { startServerInternal }