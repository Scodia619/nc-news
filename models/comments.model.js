const db = require("../db/connection.js");

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