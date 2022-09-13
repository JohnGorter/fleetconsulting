const database = require('../database/database.js')
const fetch = require('node-fetch')
const { log } = require('../utils/utils.js')

// hier is de functie gedefinieerd, hier schrijf je de code die je wil uitvoeren
async function getAPIData (url){
    log("Calling API to get data...")
    let request = fetch(url)
    let timeout = new Promise((res, rej) => { setTimeout(()=>{ log("timingout 1!!"); res('timeout')}, 1000) })
    log("start race 1")
    let result = await Promise.race([request, timeout])
    log("race finished with " + result)
    if (result == 'timeout') { log("Timout in request"); return }
    log("response: " + result.headers.get("content-length"))
    let resultastextpromise = result.text()
    let timeoutpromise = new Promise((res, rej) => { setTimeout(()=>{ log("timingout 2!!"); res('timeout')}, 3000) })
    log("start race 2")
    let textresult = await Promise.race([resultastextpromise, timeoutpromise])
    if (textresult == 'timeout') { log("Timeout in serialization"); return }
    log("Data received: length -> " + textresult.length)
    log("Data preample: " + textresult.substr(0, 20))
    textresult = textresult.replaceAll(":\"{", ":{")
    textresult = textresult.replaceAll("}\"", "}")
    textresult = textresult.replaceAll("\\\"", "\"")
    if (textresult != "") {
        const data = JSON.parse(textresult) 
        // lees het bericht als JSON en geef het geparseerde object terug
        if ("ServerRule" in data) {
            log("Error in API..." + data.ServerRule)
            return 
        }
        return data
    } else {
        log("No new data from API")
        return 
    }
}

async function storeDataInCloud(env, data){
    if (data) {
        log("Storing data in the cloud")
        return await database.insert(env, data)
    } else 
       log("no data to store in the cloud")
}

module.exports = { getAPIData, storeDataInCloud }