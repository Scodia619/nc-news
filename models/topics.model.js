const db = require("../db/connection.js");

exports.getTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        return rows
    })
}