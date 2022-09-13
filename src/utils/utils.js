const fs = require("fs")

async function delay(ms) {
    return new Promise((res, rej) => {
        setTimeout(() => { res()}, ms);
    })
}

function log(line) {
    if (fs.existsSync("log.txt")){  
        let stats = fs.statSync("log.txt").size
        if (stats > 2048) fs.rmSync("log.txt")
    }
    if (fs.existsSync("log.txt"))
        fs.appendFileSync("log.txt", Date().toLocaleLowerCase() + " " + line + "\r\n")
    else 
        fs.writeFileSync("log.txt", Date().toLocaleLowerCase() + " " + line + "\r\n")
}

module.exports = { delay, log }