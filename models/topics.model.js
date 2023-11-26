const db = require("../db/connection.js");

exports.getTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        return rows
    })
}

exports.insertNewTopic = (slug, description) => {
    if(!slug || !description){
        return Promise.reject({
            status: 400,
            msg: "Bad request"
        })
    }
    return db.query(`INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING * `, [slug, description]).then(({rows})=>{
        console.log(rows)
        return rows[0]
    })
}