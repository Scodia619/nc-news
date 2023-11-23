const { getArticles, getArticleById, patchArticleById, getArticleComments, postCommentByArticle, postNewArticle } = require("../cotrollers/articles.controller");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postNewArticle);
articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);
articleRouter.route("/:article_id/comments").get(getArticleComments).post(postCommentByArticle);

module.exports = articleRouter;
