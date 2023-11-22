const db = require("../db/connection.js");

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
exports.selectArticleById = (id) => {
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

exports.selectArticles = () => {
    return db
      .query(
        `SELECT articles.author,articles.title,articles.article_id,articles.topic,
      articles.created_at,articles.votes,articles.article_img_url,CAST(COUNT(comments.comment_id)AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY 
      articles.article_id
  ORDER BY articles.created_at DESC;`
      )
      .then(({ rows }) => {
        return rows;
      });
  };

  exports.deleteCommentById = (id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [id]).then(({rowCount}) => {
      if(rowCount !== 1){
        return Promise.reject({
            status: 404,
            msg: "Comment not found"
        })
    }
    })
  }