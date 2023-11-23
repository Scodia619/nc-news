const { patchCommentById, removeCommentById } = require("../cotrollers/comments.controller");

const commentRouter = require("express").Router();

commentRouter.route("/:comment_id").delete(removeCommentById).patch(patchCommentById);

module.exports = commentRouter;
