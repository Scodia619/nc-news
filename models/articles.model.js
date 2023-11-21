const db = require("../db/connection.js");

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
    console.log("Models")
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

  exports.selectArticleComments = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1`, [id]).then(({rows}) => {
        if(!rows.length){
            return Promise.reject({
                status: 404,
                msg: "Article not found"
            })
        }
        return rows
    })
  }