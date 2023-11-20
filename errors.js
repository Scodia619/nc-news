exports.customErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  };

  exports.psqlErrors = (err, req, res, next) => {
    if (err.code === "42703" || err.code === '22P02' || err.code === "23502") res.status(400).send({ msg: "Bad request" });
    next(err);
  };