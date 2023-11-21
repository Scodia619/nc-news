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

exports.selectArticleComments = (id) => {
    return db
      .query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
        [id]
      )
      .then(({ rows }) => {
        if (!rows.length) {
          return db
            .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
            .then(({ rows }) => {
              if (!rows.length) {
                return Promise.reject({
                  status: 404,
                  msg: "Article not found",
                });
              }else{
                  return []
              }
            });
        }
        return rows;
      });
  };