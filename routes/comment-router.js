const { removeCommentById } = require("../cotrollers/articles.controller");

const commentRouter = require("express").Router();

commentRouter.route("/:comment_id").delete(removeCommentById);

module.exports = commentRouter;
