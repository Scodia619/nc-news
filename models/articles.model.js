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
            } else {
              return [];
            }
          });
      }
      return rows;
    });
};
exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows[0];
    });
};

exports.updateArticleById = (id, increment) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *",
      [id, increment]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows[0];
    });
};
exports.selectArticles = (topic) => {

  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic,
    articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) {
    queryString += ` WHERE topic = $1`;
  }

  queryString += ` GROUP BY articles.article_id ORDER BY articles.created_at DESC`;

  return db
    .query(queryString, topic ? [topic] : [])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows;
    })
};

exports.deleteCommentById = (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [id])
    .then(({ rowCount }) => {
      if (rowCount !== 1) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticleById = (id, increment) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *",
      [id, increment]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows[0];
    });
};

exports.insertCommentByArticle = (id, username, body) => {
  if (!username || !body) {
    ("Reject, ", id, username, body)
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *",
      [id, username, body]
    )
    .then(response => {
      return response.rows[0]; 
    })
};
