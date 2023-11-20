const fs = require("fs/promises")
const path = require('path')

exports.getEndpoints = () => {
    return fs.readFile(path.join(__dirname, `/../endpoints.json`), `utf8`)
    .then((data)=> {
        console.log(JSON.parse(data))
        return JSON.parse(data)
    })
}