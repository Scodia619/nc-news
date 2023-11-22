const db = require("../db/connection.js");

exports.getArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then(({rows})=> {
        if(!rows.length){
            return Promise.reject({
                status: 404,
                msg: "Article not found"
            })
        }
        return rows[0]
    })
}

exports.updateArticleById = (id, increment) => {
    return db.query('UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *', [id, increment]).then(({rows})=>{
        if(!rows.length){
            return Promise.reject({
                status: 404,
                msg: "Article not found"
            })
        }
        return rows[0]
    })
} 