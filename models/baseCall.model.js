const fs = require("fs/promises")
const path = require('path')

exports.getEndpoints = () => {
    return fs.readFile(path.join(__dirname, `/../endpoints.json`), `utf8`)
    .then((data)=> {
        return JSON.parse(data)
    })
}