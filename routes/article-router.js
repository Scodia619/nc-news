const { getArticles, getArticleById, patchArticleById, getArticleComments, postCommentByArticle } = require("../cotrollers/articles.controller");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles);
articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);
articleRouter.route("/:article_id/comments").get(getArticleComments).post(postCommentByArticle);

module.exports = articleRouter;
