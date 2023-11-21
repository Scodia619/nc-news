const db = require("../db/connection.js");

exports.getArticleById = (id) => {
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

exports.selectArticleComments = (id) => {
  
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({rows}) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
        }
        return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,[id])
    }).then(({rows}) => {
        if(!rows.length){
            return []
        }else{
            return rows
        }
    });

//   return db
//     .query(
//       `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
//       [id]
//     )
//     .then((response) => {
//       console.log("Selecting all articles", response);
//       if (!rows.length) {
//         return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]);
//       }
//     })
//     .then((response) => {
//       console.log("Inside 2nd query");
//       if (!response.length) {
//         console.log("No Rows");
//         return Promise.reject({
//           status: 404,
//           msg: "Article not found",
//         });
//       } else if (response.length === 0) {
//         return [];
//       } else {
//         return response;
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
};
