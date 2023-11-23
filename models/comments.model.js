const db = require("../db/connection.js");

exports.insertCommentByArticle = (id, username, body) => {
  if (!username || !body) {
    "Reject, ", id, username, body;
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
    .then((response) => {
      return response.rows[0];
    });
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

exports.updateCommentById = (id, increment) => {
  return db
    .query(
      "UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *",
      [id, increment]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
      return rows[0];
    });
};
