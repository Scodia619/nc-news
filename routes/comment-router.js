const { removeCommentById } = require("../cotrollers/articles.controller");
const { patchCommentById } = require("../cotrollers/comments.controller");

const commentRouter = require("express").Router();

commentRouter.route("/:comment_id").delete(removeCommentById).patch(patchCommentById);

module.exports = commentRouter;
