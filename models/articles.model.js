const db = require("../db/connection.js");
const {format} = require('pg-format')

exports.selectArticleComments = (id, limit, page) => {
  const limitVals = [5, 10, 25]
  if (!limitVals.includes(limit)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  const offset = limit * page - limit

  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
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
    .query(
      `SELECT articles.*,
      CAST(COUNT(comments.comment_id)AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`,
      [id]
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
exports.selectArticles = (topic, sort, order, limit, page) => {
  const queryParams = [];
  let queryString = `
    SELECT (SELECT COUNT(*)::INT FROM articles ${
      topic ? ` WHERE articles.topic = $1 ` : ``
    }) as total_count, articles.author, articles.title, articles.article_id, articles.topic,
    articles.created_at, articles.votes, articles.article_img_url, 
    CAST(COUNT(comments.comment_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
  `;

  if (topic) {
    queryString += ` WHERE topic = $1`;
    queryParams.push(topic);
  }

  if (sort && order) {
    const allowedSortColumns = ['created_at', 'votes', 'article_id', 'title', 'author'];
    const allowedOrders = ['DESC', 'ASC'];

    if (!allowedSortColumns.includes(sort) || !allowedOrders.includes(order)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid sort column or order",
      });
    }
  }

    if (limit) {
      const allowedLimits = [5, 10, 25];
      if (!allowedLimits.includes(parseInt(limit))) {
        return Promise.reject({
          status: 400,
          msg: "Bad request",
        });
      }
    }

    const offset = limit * page - limit;

    queryString += ` 
    GROUP BY articles.article_id 
    ORDER BY articles.${sort} ${order} 
    LIMIT ${limit} 
    OFFSET ${offset}`;

  return db
    .query(queryString, queryParams)
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Articles not found",
        });
      }else{
        return {articles: rows, total_count:rows[0].total_count};
      }
    })
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

exports.insertNewArticle = (author, title, body, topic, article_img_url) => {
  if(!author || !title || !body || !topic){
    return Promise.reject({
      status: 400,
      msg: "Bad request"
    })
  }
  let queryString;
  if(!article_img_url){
    queryString = 'INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *'
  }else{
    queryString = 'INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *'
  }
  return db.query(queryString, article_img_url ? [author, title, body, topic, article_img_url]: [author, title, body, topic]).then(({rows}) =>{
    return rows[0]
  })
}

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

exports.removeArticleById = (id) => {
  return db.query(`DELETE FROM articles WHERE article_id = $1`, [id]);
};