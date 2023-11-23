const db = require("../db/connection.js");

exports.selectUserById = (username) => {
    if((!isNaN(Number(username)))) {
        return Promise.reject({
          status: 400,
          msg: "Bad request",
        });
    }
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "No users found",
        });
      }
      return rows[0];
    });
};
