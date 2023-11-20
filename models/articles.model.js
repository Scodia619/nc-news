const db = require("../db/connection.js");

exports.getArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then(({rows})=> {
        if(!rows.length){
            return Promise.reject({
                status: 404,
                msg: "Article not found"
            })
        }
        console.log("After if model")
        return rows[0]
    })
}