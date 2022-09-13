// hier roep je de functie aan als je dit script start..
const env = require('./env.json')
const { getAPIData, storeDataInCloud } = require("./src/import/import.js")
const { getDataFromCloud, writeDataToCSV } = require('./src/export/export.js');
const { startServerInternal } = require("./src/server/server.js")
const { delay, log } = require("./src/utils/utils.js")

startImport(); 
startServer(); 


async function startImport() {
    while(true){
        log("getting data at interval.." + (globalThis.interval ?? env.timer.value))
        await storeDataInCloud(env.mysql, await getAPIData(env.api.url))
        await delay(globalThis.interval ?? env.timer.value);
    }
}

async function startServer(){
    log("starting server..")
    startServerInternal(env.server.port); 
}







